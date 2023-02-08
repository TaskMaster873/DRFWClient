import { Logger } from "../Logger";
import { StatusMessage } from "../messages/StatusMessage";

import { Config } from "../Config";
import { PacketBuilder } from "./PacketBuilder";

import protobuf from 'protobufjs';
import {Opcodes} from "../types/Opcodes";
import {AuthenticationStatus, AuthenticationStatusType} from "../types/AuthenticationStatus";
import { AuthData, SessionKey } from "../types/AuthData";
import ServiceNotification from "../services/ServiceNotification";
import {Encryptem} from "./Encryptem";
import {ServerKeyCipherExchange} from "../types/Packets";
import { EmployeeCreateDTO } from "../types/Employee";

class WebsocketManager extends Logger {
    public moduleName: string = 'WebsocketManager';
    public logColor: string = '#9370db';

    private handlePacket: (opcode: number, message: Uint8Array) => void = this.readOnlyPacketHandler.bind(this);
    // @ts-ignore
    private ws: WebSocket = null;

    private packetBuilder: PacketBuilder = new PacketBuilder();

    private schema: any = null;
    private isFullAuth: boolean = false;
    private pingInterval: any = null;

    private latency: number = 0;
    private encryptem: Encryptem = new Encryptem();

    private encryptionStarted: boolean = false;

    constructor() {
        super();
    }

    get isSecure() : boolean {
        // eslint-disable-next-line no-restricted-globals
        return location.protocol.includes('https') || false;
    }

    get shouldUseRemote() : boolean {
        let useRemote = true;

        // eslint-disable-next-line no-restricted-globals
        if(location.origin.includes('localhost') || location.origin.includes('127.0.0.1')) {
            useRemote = false;
        }

        return useRemote;
    }

    /*
     * ---------------------------------------------User Actions------------------------------------------------
     */

    public async changePassword(oldPassword: string, newPassword: string) : Promise<void> {
        //TODO
        //throw new Error("Not Implemented");
    }

    /**
     * Attempts logging in with provided username and password
     * @param username 
     * @param password 
     */
    public async loginWithPassword(username: string, password: string) : Promise<void> {
        if(username === null || !username) {
            throw new Error('Username is null or empty');
        }

        if(password === null || !password) {
            throw new Error('Password is null or empty');
        }
        //Get AuthKey
        let authKey = await this.encryptem.generateClientCipherKeyPair(password);
        //Save Session to local storage
        Config.sessionKey = {
            clientId: username,
            clientPubKey: authKey.clientPubKey,
            clientAuthKey: authKey.clientAuthKey,
            clientHash: authKey.clientHash
        }
        //Send SessionKey to backend for verification
        await this.sendAuthPacket();
    }

    /**
     * Builds the Create Employee packet ands sends it to backend
     * @param employeeDTO 
     */
    public async createEmployee(employeeDTO: EmployeeCreateDTO) : Promise<void> {
        let authData = await this.encryptem.generateAuthData(employeeDTO.password);
        let employeeCreatePacket = await this.packetBuilder.buildEmployeeCreatePacket(employeeDTO, authData);

        if(employeeCreatePacket !== null && employeeCreatePacket) {
            await this.sendMsg(employeeCreatePacket);
        }
    }

    /*
     * ---------------------------------------------Routers------------------------------------------------
     */

    private async readOnlyPacketHandler(opcode: number, message: Uint8Array) : Promise<void> {
        switch(opcode) {
            case Opcodes.InBound.AUTHENTICATION_STATUS: {
                await this.onAuthenticationStatus(message);
                break;
            }
            case Opcodes.InBound.PONG: {
                await this.onPong(message);
                break;
            }
            case Opcodes.InBound.SERVER_CIPHER_EXCHANGE: {
                await this.parseKeyCipherExchangeServerPacket(message);
                break;
            }
            default: {
                this.warn(`Unhandled packet opcode: ${opcode}`);
            }
        }
    }

    /*
     * ---------------------------------------------Route Methods------------------------------------------------
     */

    private async onPing() : Promise<void> {
        let pingPacket = await this.packetBuilder.buildPingPacket();
        if(pingPacket !== null && pingPacket) {
            await this.sendMsg(pingPacket);
        }
    }

    private async onAuthenticationStatus(packet: Uint8Array): Promise<void> {
        let authType = packet[0];
        this.log(`Authentication type: ${authType}`);

        let data = packet.slice(1);
        let authStatus: AuthenticationStatus = await this.packetBuilder.parseAuthenticationStatus(authType, data);

        if(authStatus !== null && authStatus) {
            if(authStatus.status === AuthenticationStatusType.SUCCESS) {
                this.log(`Authentication status received -> ${authStatus.message}`);

                if(authType === 1) {
                    this.isFullAuth = true;

                    await this.onFullAuth(authStatus);
                } else {
                    this.clearIntervals();
                    this.startPingInterval();
                    await this.onPing();

                    this.warn(`Received a partial authentication status.`);
                    this.changeStatus(StatusMessage.WAITING_FOR_LOGIN);

                    ServiceNotification.notifyInformation(`Partial authentication status received. Waiting for user logins..`);
                }
            } else {
                let message = authStatus.message;
                this.error(`Failed to authenticate -> ${message}`);

                ServiceNotification.notifyClientError(`Failed to authenticate. ${authStatus.message}`);
                await Config.resetSession();

                setTimeout(async () => {
                    await this.closeWs();
                }, 6000);
            }
        }
    }

    private async responsePong2(): Promise<void> {
        let pong2Packet = new Uint8Array([Opcodes.OutBound.PONG]);
        await this.sendMsg(pong2Packet);
    }

    private async onPong(message: Uint8Array) : Promise<void> {
        // @ts-ignore
        let latency = Number(BigInt(this.packetBuilder.getUtcTime()) - this.packetBuilder.currentPingTimeStamp);

        this.latency = latency;
        this.onLatencyChange(latency);

        await this.responsePong2();
    }

    private async parseKeyCipherExchangeServerPacket(packet: Uint8Array) : Promise<void> {
        let serverKeyCipherExchange: ServerKeyCipherExchange = await this.packetBuilder.parseKeyCipherExchangeServerPacket(packet);

        if(serverKeyCipherExchange !== null && serverKeyCipherExchange) {
            this.encryptem.setServerPublicKey(Buffer.from(serverKeyCipherExchange.serverKeyCipher));
            this.encryptem.setServerSignaturePublicKey(Buffer.from(serverKeyCipherExchange.serverSigningCipher));
            this.encryptionStarted = serverKeyCipherExchange.encryptionEnabled;

            this.log(`Client public key:\n${this.convertToCertificate(this.encryptem.getClientPublicKey())}`);
            this.log(`Client signature public key:\n${this.convertToCertificate(this.encryptem.getClientSignaturePublicKey())}`);
            this.log(`Server public key:\n${this.convertToCertificate(this.encryptem.getServerPublicKey())}`);
            this.log(`Server signature public key:\n${this.convertToCertificate(this.encryptem.getServerSignaturePublicKey())}`);
            this.warn(`!!! -- Encryption started. -- !!!`);

            this.encryptem.startEncryption();

            this.changeStatus(StatusMessage.CONNECTED);

            this.clearIntervals();
            this.startPingInterval();
            await this.onPing();
        }
    }

    /*
     * ---------------------------------------------Other------------------------------------------------
     */

    private getConnectionUri() : string {
        if(this.shouldUseRemote) {
            return Config.connectionURIRemote;
        } else {
            return Config.connectionURILocal;
        }
    }

    private async onFullAuth(authStatus: AuthenticationStatus) : Promise<void> {

    }

    private clearIntervals() : void {
        clearInterval(this.pingInterval);
    }

    

    private startPingInterval() : void {
        this.pingInterval = setInterval(async () => {
            await this.onPing();
        }, 1000 * 0.5);
    }

    private closeWs() : void {
        if(this.ws.readyState === WebSocket.OPEN) {
            this.ws.close();
        }
    }

    private convertToCertificate(keypair: Buffer) : string{
        let out = `------BEGIN PUBLIC KEY-----\r\n`;
        out += keypair.toString('base64') + '\r\n';
        out += `------END PUBLIC KEY-----`;

        return out;
    }

    private async sendMsg(msg: Uint8Array) : Promise<void> {
        if(this.ws !== null && this.ws && this.ws.readyState === WebSocket.OPEN) {
            try {
                if(this.packetBuilder.encryptionStarted) {
                    msg = await this.packetBuilder.encryptMessage(msg);
                }

                await this.ws.send(msg);
            } catch (e: any) {
                this.error(`Failed to send message. ${e.stack}`);
            }
        }
    }

    private async sendAuthPacket() : Promise<void> {
        let authPacket = await this.packetBuilder.buildAuthenticationPacket();

        if(authPacket !== null && authPacket) {
            await this.sendMsg(authPacket);
        }
    }

    private async onConnectionOpen() : Promise<void> {
        this.log(`Connection opened.`);
        this.changeStatus(StatusMessage.AUTHENTICATING);

        await this.sendAuthPacket();
    }

    private reset() : void {
        this.handlePacket = this.readOnlyPacketHandler.bind(this);

        this.packetBuilder.reset();
    }

    private async onConnectionMessage(message: MessageEvent) : Promise<void> {
        if(this.handlePacket !== null && this.handlePacket) {
            try {
                let data = new Uint8Array(message.data);

                // TODO: Decrypt data
                /*if(this.encryptionStarted) {
                    let decrypted = await this.encryptem.decrypt(message.data);
                    data = decrypted;
                }*/

                let opcode = data[0];
                let packet = data.slice(1);

                await this.handlePacket(opcode, packet);
            } catch(e: any) {
                this.error(`Something went wrong ${e.stack}`);
            }
        } else {
            this.warn(`Message handler is null or undefined.`);
        }
    }

    private async onConnectionError(error: Event) : Promise<void> {
        this.changeStatus(StatusMessage.CONNECTION_ERROR);
        this.error(`Connection encountered an error: ${error}`);
    }

    private async onConnectionClose() : Promise<void> {
        this.changeStatus(StatusMessage.DISCONNECTED);
        this.warn(`Connection closed. Reconnecting...`);

        // @ts-ignore
        this.ws = null;
        setTimeout(this.connectToAPI.bind(this), 1500);

        this.encryptem.reset();
    }

    private async connect() : Promise<void> {
        this.reset();

        this.log(`Connecting to ${this.generateConnectionURI()}`);
        this.changeStatus(StatusMessage.CONNECTING);

        this.ws = new WebSocket(this.generateConnectionURI());

        this.ws.binaryType = 'arraybuffer';
        this.ws.onopen = this.onConnectionOpen.bind(this);
        this.ws.onerror = this.onConnectionError.bind(this);
        this.ws.onclose = this.onConnectionClose.bind(this);
        this.ws.onmessage = this.onConnectionMessage.bind(this);
    }

    private async createProtobufManager() : Promise<void> {
        this.packetBuilder.setRootSchema(this.schema.root);

        this.packetBuilder.getSodium();
        if (this.packetBuilder.hasSodium()) {
            await this.connect();
        } else {
            this.error(`Failed to get sodium.`);
        }
    }

    private async getSchemaFromAPI() : Promise<void> {
        try {
            this.changeStatus(StatusMessage.FETCHING_SCHEMA);
            const response = await fetch(this.generateSchemaUri());

            if(response && response !== null) {
                if (response.status !== 200) {
                    this.error(`Failed to fetch schema from API: ${response.statusText}`);
                    return;
                }

                try {
                    if(response !== null && response) {
                        const schema = await response.text();

                        if(schema !== null && schema) {
                            this.schema = protobuf.parse(schema.toString());

                            await this.createProtobufManager();
                        } else {
                            this.warn(`Schema is null or empty.`);
                        }
                    } else {
                        this.warn(`Schema is null or undefined.`);
                    }
                } catch(e: any) {
                    this.error(`Failed to parse schema from API: ${e.stack}`);
                }
            }
        } catch(e: any) {
            this.error(`[APÎ] Failed to fetch schema from API: ${e.stack}`);
            this.changeStatus(StatusMessage.DISCONNECTED);

            setTimeout(this.getSchemaFromAPI.bind(this), 1500);
        }
    }

    private changeStatus(status: StatusMessage) : void {
        this.warn(`Status changed to ${status}.`);
    }

    private async connectToAPI() : Promise<void> {
        if(this.ws !== null) {
            if(this.ws.readyState === WebSocket.OPEN) {
                this.ws.close();

                this.reset();
            }
        } else {
            await this.getSchemaFromAPI();
        }
    }

    public init() : void {
        this.log('Websocket manager initialized.');

        this.connectToAPI();
    }

    private generateSchemaUri() : string {
        return `${this.isSecure ? 'https' : 'http'}://${this.getConnectionUri()}:${Config.connectionPort}/${Config.apiPath}${Config.schemaAPIPath}`;
    }

    private generateConnectionURI() : string {
        return `${this.isSecure ? 'wss' : 'ws'}://${this.getConnectionUri()}:${Config.connectionPort}/${Config.apiPath}${Config.connectionPath}`;
    }

    public onLatencyChange(newLatency: number) : void {
        this.log(`Latency changed to ${newLatency}ms.`);
    }
}

const SocketManager = new WebsocketManager();
export { SocketManager };