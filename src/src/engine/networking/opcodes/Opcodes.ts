enum ClientInBound {
    PONG = 0x00,
    AUTHENTICATION_STATUS = 0x01,
    SERVER_CIPHER_EXCHANGE = 0x02,
}

enum ClientOutBound {
    AUTHENTICATION = 0x00,
    PING = 0x01,
    PONG = 0x02,
    CLIENT_CIPHER_EXCHANGE = 0x03,
    CREATE_EMPLOYE = 0x04
}

export const Opcodes = {
    InBound: ClientInBound,
    OutBound: ClientOutBound,
}
