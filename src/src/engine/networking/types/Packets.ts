


export interface AuthenticationPacketPayload {
    readOnly: boolean;
    clientAuthCipher?: Uint8Array | Buffer;
}

export interface ServerKeyCipherExchange {
    serverKeyCipher: Uint8Array | Buffer;
    serverSigningCipher: Uint8Array | Buffer;
    encryptionEnabled: boolean;
}