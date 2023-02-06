export interface AuthData {
    clientPubKey: Buffer;
    clientAuthKey: Buffer;
    clientHash: string;
}

export interface SessionKey extends AuthData {
    clientId: string;
}