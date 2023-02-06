export enum AuthenticationStatusType {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

export interface AuthenticationStatus {
    status: AuthenticationStatusType;
    message: string;
}

