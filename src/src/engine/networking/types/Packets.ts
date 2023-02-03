export interface AuthenticationPacketPayload {
    readOnly: boolean;
    clientAuthCipher?: Uint8Array | Buffer;
    clientAuthKey?: Uint8Array | Buffer;
    clientId?: string;
    clientHash?: string;
}

export interface ServerKeyCipherExchange {
    serverKeyCipher: Uint8Array | Buffer;
    serverSigningCipher: Uint8Array | Buffer;
    encryptionEnabled: boolean;
}

export interface EmployePayload {
    clientId?: string;
    firstName?: string;
    lastName?: string;
    isAdmin?: boolean;
    phoneNumber?: string;
    clientAuthCipher?: Uint8Array | Buffer;
    clientAuthKey?: Uint8Array | Buffer;
    clientHash?: string;
}