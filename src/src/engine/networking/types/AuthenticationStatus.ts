export enum AuthenticationStatusType {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

export interface AuthenticationStatus {
    status: AuthenticationStatusType;
    message: string;
}

export interface AuthKey {
    clientAuthCipher: Buffer;
    clientAuthKey: Buffer;
    clientHash: string;
}

export interface SessionKey extends AuthKey {
    clientId: string,
}

export interface EmployeeData {
    clientId: string;
    firstName: string;
    lastName: string;
    password: string;
    isAdmin: boolean;
    phoneNumber: string;
}