import {Logger} from "../Logger";

import protobuf from 'protobufjs';

import * as sodium from 'sodium-universal';
import {Buffer} from 'buffer';
import {AuthenticationStatus} from "../types/AuthenticationStatus";
import {AuthData, SessionKey} from "../types/AuthData";
import Long from 'long';
import {Opcodes} from "../types/Opcodes";
import {Config} from "../Config";
import {
    AuthenticationPacketPayload,
    EmployeCreatePayload,
    PacketPayload,
    ServerKeyCipherExchange
} from "../types/Packets";
import {EmployeeCreateDTO} from "../types/Employee";

protobuf.util.Long = Long;
protobuf.configure();

export class PacketBuilder extends Logger {
    public moduleName: string = 'PacketBuilder';
    public logColor: string = '#70a6db';

    // @ts-ignore
    private packetBuilderRoot: protobuf.Root = null;

    // @ts-ignore
    private rndSalt: Uint8Array = null;

    // @ts-ignore
    public currentPingTimeStamp: BigInt = null;

    // @ts-ignore
    public lastPingTimeStamp: BigInt = null;

    public encryptionStarted: boolean = false;

    constructor() {
        super();

        this.init();
    }

    /*
     * ---------------------------------------------Packet Builders------------------------------------------------
     */

    public async buildAuthenticationPacket(): Promise<Uint8Array> {
        let packet: Uint8Array;

        if (Config.sessionKey !== null && Config.sessionKey) {
            this.log(`Authenticating with auth key.`);

            // Let's try to authenticate on the first try.
            packet = await this.buildAuthenticationPacketWithClientKey();
        } else {
            this.log(`Generating read-only authentication packet. Auth key is not set.`);

            packet = await this.buildReadOnlyAuthenticationPacket();
        }

        return packet;
    }

    private async buildReadOnlyAuthenticationPacket(): Promise<Uint8Array> {
        // @ts-ignore
        let packet: Uint8Array = null;

        try {
            let payload: AuthenticationPacketPayload = {
                readOnly: true
            };

            packet = await this.buildPacket(Opcodes.OutBound.AUTHENTICATION, 'TaskMaster.Authentication', payload);
        } catch (e: any) {
            this.error(`Failed to build auth (readonly) packet. ${e.stack}`);
        }

        return packet;
    }

    private async buildAuthenticationPacketWithClientKey(): Promise<Uint8Array> {
        // @ts-ignore
        let packet: Uint8Array = null;
        try {
            let sessionKey: SessionKey = Config.sessionKey;
            let payload: AuthenticationPacketPayload = {
                readOnly: false,
                clientId: sessionKey.clientId,
                clientPubKey: Buffer.from(sessionKey.clientPubKey),
                clientAuthKey: Buffer.from(sessionKey.clientAuthKey),
                clientHash: sessionKey.clientHash,
            };

            packet = await this.buildPacket(Opcodes.OutBound.AUTHENTICATION, 'TaskMaster.Authentication', payload);
        } catch (e: any) {
            this.error(`Failed to build auth (with key) packet. ${e.stack}`);
        }

        return packet;
    }

    /**
     * Builds the EmployeeCreateDTO Packet with auths
     * @param employeeDTO 
     * @param authData 
     * @returns 
     */
    public async buildEmployeeCreatePacket(employeeDTO: EmployeeCreateDTO, authData: AuthData): Promise<Uint8Array> {
        // @ts-ignore
        let packet: Uint8Array = null;
        try {
            let payload: EmployeCreatePayload = {
                id: employeeDTO.id,
                firstName: employeeDTO.firstName,
                lastName: employeeDTO.lastName,
                phoneNumber: employeeDTO.phoneNumber,
                clientPubKey: authData.clientPubKey,
                clientAuthKey: authData.clientAuthKey,
                clientHash: authData.clientHash
            };

            packet = await this.buildPacket(Opcodes.OutBound.CREATE_EMPLOYEE, 'TaskMaster.EmployeeCreate', payload);
        } catch (e: any) {
            this.error(`Failed to build employee create packet. ${e.stack}`);
        }

        return packet;
    }

    public async buildPingPacket(): Promise<Uint8Array> {
        // @ts-ignore
        let packet: Uint8Array = null;
        try {
            this.lastPingTimeStamp = this.currentPingTimeStamp || 0n;
            this.currentPingTimeStamp = BigInt(this.getUtcTime());

            let payload = {
                timestamp: Long.fromString(this.currentPingTimeStamp.toString()),
                lastPing: Long.fromString(this.lastPingTimeStamp.toString())
            };
            packet = await this.buildPacket(Opcodes.OutBound.PING, 'TaskMaster.Ping', payload)
        } catch (e: any) {
            this.error(`Failed to build ping packet. ${e.stack}`);
        }

        return packet;
    }

    /**
    * Generalised packet builder
    * @param opcode A number represented in Opcodes.ts
    * @param protoType A string path found in the server file .proto
    * @param payload The payload to send
    * @returns A nicely packaged packet ready to send
    */
    private async buildPacket(opcode: number, protoType: string, payload: PacketPayload): Promise<Uint8Array> {
        // @ts-ignore
        let packet: Uint8Array = null;

        let basePacket = this.packetBuilderRoot.lookupType(protoType);
        let verificationError = basePacket.verify(payload);
        if (verificationError) {
            this.error(`Something went wrong while building the ${protoType} packet. ${verificationError}`);
        } else {
            let msg = basePacket.create(payload);
            packet = basePacket.encode(msg).finish();

            packet = new Uint8Array([opcode, ...packet]);
        }

        return packet;
    }

    /*
     * ---------------------------------------------Packet Parsers------------------------------------------------
     */

    public async parseKeyCipherExchangeServerPacket(packet: Uint8Array): Promise<ServerKeyCipherExchange> {
        // @ts-ignore
        let serverKeyCipherExchange: ServerKeyCipherExchange = null;
        try {
            let serverCipherKeyPacketSchema = this.packetBuilderRoot.lookupType(`TaskMaster.ServerKeyCipherExchange`);

            let decoded = serverCipherKeyPacketSchema.decode(packet);
            serverKeyCipherExchange = serverCipherKeyPacketSchema.toObject(decoded, {
                longs: Long,
                enums: String,
                bytes: Uint8Array,
                defaults: true,
                arrays: true,
                objects: true,
                oneofs: true
            }) as ServerKeyCipherExchange;
        } catch (e: any) {
            this.error(`Failed to parse server cipher key exchange packet. ${e.stack}`);
        }

        return serverKeyCipherExchange;
    }

    public async parseAuthenticationStatus(authType: number, packet: Uint8Array): Promise<AuthenticationStatus> {
        let status: any = null;

        try {
            let type = `TaskMaster.ReadOnlyAuthenticationStatus`;
            if (authType === 1) {
                type = `TaskMaster.FullAuthenticationStatus`;
            }

            let authStatusSchema = this.packetBuilderRoot.lookupType(type);
            let decoded = authStatusSchema.decode(packet);
            status = authStatusSchema.toObject(decoded, {
                longs: Long,
                enums: String,
                bytes: Uint8Array,
                defaults: true,
                arrays: true,
                objects: true,
                oneofs: true
            });
        } catch (e: any) {
            this.error(`Failed to parse authentication status. ${e.message}`);
        }

        return status;
    }

    /*
     * ---------------------------------------------Other------------------------------------------------
     */

    public reset(): void {
        // @ts-ignore
        this.rndSalt = null;
    }

    public async encryptMessage(msg: Uint8Array): Promise<Uint8Array> {
        return msg;
    }

    private init(): void {
        this.log(`PacketBuilder initialized.`);
    }

    public setRootSchema(root: protobuf.Root): void {
        this.packetBuilderRoot = root;
    }

    public getSodium(): void {
        let rnd = Buffer.allocUnsafe(12);
        sodium.randombytes_buf(rnd);

        this.rndSalt = rnd;
    }

    hasSodium() {
        return this.rndSalt !== null;
    }

    public getUtcTime(): number {
        let d = new Date();
        let localTime = d.getTime();

        let utc = localTime;

        return utc;
    }
}