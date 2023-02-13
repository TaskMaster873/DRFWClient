export interface AuthenticationPacketPayload extends PacketPayload {
    readOnly: boolean;
    clientId?: string;
    clientPubKey?: Uint8Array | Buffer;
    clientAuthKey?: Uint8Array | Buffer;
    clientHash?: string;
}

export interface ServerKeyCipherExchange {
    serverKeyCipher: Uint8Array | Buffer;
    serverSigningCipher: Uint8Array | Buffer;
    encryptionEnabled: boolean;
}

export interface EmployeCreatePayload extends PacketPayload {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    departmentId?: string;
    jobTitles?: string[];
    clientPubKey: Uint8Array | Buffer;
    clientAuthKey: Uint8Array | Buffer;
    clientHash: string;
}

export interface PacketPayload { }