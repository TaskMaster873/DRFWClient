export interface ComponentPropsLogin {
    onLoginRequest: (email: string, password: string) => Promise<boolean>;
}
