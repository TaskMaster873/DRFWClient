import { Logger } from "../Logger";

import protobuf from 'protobufjs';

import * as sodium from 'sodium-universal';
import { Buffer } from 'buffer';
import { AuthenticationStatus, AuthKey, EmployeeData, SessionKey } from "./types/AuthenticationStatus";
import Long from 'long';
import { Opcodes } from "./opcodes/Opcodes";
import { Config } from "../config/Config";
import { AuthenticationPacketPayload, EmployePayload, ServerKeyCipherExchange } from "./types/Packets";

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

    // POST AUTHENTICATION
    private async buildReadOnlyAuthenticationPacket(): Promise<Uint8Array> {
        // @ts-ignore
        let packet: Uint8Array = null;

        try {
            let payload: AuthenticationPacketPayload = {
                readOnly: true
            };

            packet = await this.buildAuthPacket(payload);
        } catch (e: any) {
            this.error(`Failed to build auth (readonly) packet. ${e.stack}`);
        }

        return packet;
    }

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

    private startPingInterval(): void {

    }

    private onPing(): void {

    }

    private clearIntervals(): void {

    }

    private async buildAuthPacket(payload: AuthenticationPacketPayload): Promise<Uint8Array> {
        // @ts-ignore
        let packet: Uint8Array = null;

        let authenticationPacket = this.packetBuilderRoot.lookupType('TaskMaster.Authentication');
        let verificationError = authenticationPacket.verify(payload);
        if (verificationError) {
            this.error(`Something went wrong while building the auth packet. ${verificationError}`);
        } else {
            let msg = authenticationPacket.create(payload);
            packet = authenticationPacket.encode(msg).finish();

            packet = new Uint8Array([Opcodes.OutBound.AUTHENTICATION, ...packet]);
        }

        return packet;
    }

    /**
     * Packages the packet for sending, end of chain. Packet is ready to send
     * @param payload 
     * @returns 
     */
    private async buildEmployeePacket(payload: EmployePayload): Promise<Uint8Array> {
        // @ts-ignore
        let packet: Uint8Array = null;

        let employeePacket = this.packetBuilderRoot.lookupType('TaskMaster.Employee');
        let verificationError = employeePacket.verify(payload);
        if (verificationError) {
            this.error(`Something went wrong while building the employee packet. ${verificationError}`)
        } else {
            let msg = employeePacket.create(payload);
            packet = employeePacket.encode(msg).finish();

            packet = new Uint8Array([Opcodes.OutBound.CREATE_EMPLOYE, ...packet]);
        }

        return packet;
    }

    /**
     * Builds the Employee Packet with auths
     * @param clientId 
     * @param firstName 
     * @param lastName 
     * @param phoneNumber 
     * @param isAdmin 
     * @returns 
     */
    public async buildEmployeePacketWithAuthKey(employeeData: EmployeeData, authKey: AuthKey): Promise<Uint8Array> {
        // @ts-ignore
        let packet: Uint8Array = null;
        try {
            let payload: EmployePayload = {
                clientId: employeeData.clientId,
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                isAdmin: employeeData.isAdmin,
                phoneNumber: employeeData.phoneNumber,
                clientAuthCipher: authKey.clientAuthCipher,
                clientAuthKey: authKey.clientAuthKey,
                clientHash: authKey.clientHash
            };

            packet = await this.buildEmployeePacket(payload);
        } catch (e: any) {
            this.error(`Failed to build employee (with key) packet. ${e.stack}`);
        }

        return packet;
    }

    // AUTHENTICATION
    private async buildAuthenticationPacketWithClientKey(): Promise<Uint8Array> {
        // @ts-ignore
        let packet: Uint8Array = null;
        try {
            let sessionKey: SessionKey = Config.sessionKey;
            let payload: AuthenticationPacketPayload = {
                readOnly: false,
                clientId: sessionKey.clientId,
                clientAuthCipher: Buffer.from(sessionKey.clientAuthCipher),
                clientAuthKey: Buffer.from(sessionKey.clientAuthKey),
                clientHash: sessionKey.clientHash,
            };

            packet = await this.buildAuthPacket(payload);
        } catch (e: any) {
            this.error(`Failed to build auth (with key) packet. ${e.stack}`);
        }

        return packet;
    }

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

    public async buildPingPacket(): Promise<Uint8Array> {
        // @ts-ignore
        let packet: Uint8Array = null;
        try {
            let pingPacketSchema = this.packetBuilderRoot.lookupType(`TaskMaster.Ping`);

            this.lastPingTimeStamp = this.currentPingTimeStamp || 0n;
            this.currentPingTimeStamp = BigInt(this.getUtcTime());

            let payload = {
                timestamp: Long.fromString(this.currentPingTimeStamp.toString()),
                lastPing: Long.fromString(this.lastPingTimeStamp.toString())
            };

            let verificationError = pingPacketSchema.verify(payload);
            if (verificationError) {
                this.error(`Something went wrong while building the ping packet. ${verificationError}`);
            } else {
                let msg = pingPacketSchema.create(payload);
                packet = pingPacketSchema.encode(msg).finish();

                packet = new Uint8Array([Opcodes.OutBound.PING, ...packet]);
            }
        } catch (e: any) {
            this.error(`Failed to build ping packet. ${e.stack}`);
        }

        return packet;
    }
}