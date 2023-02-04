import { SessionKey } from '../networking/types/AuthenticationStatus';

class Configuration {
    readonly connectionURIRemote: string = '';
    readonly connectionURILocal: string = 'localhost';

    readonly connectionPort: number = 9002;
    readonly connectionPath: string = '/ws';

    readonly apiPath: string = 'api/v1';
    readonly schemaAPIPath: string = `/schema`;

    public resetSession() {
        localStorage.removeItem('sessionKey');
    }

    public changePassword(oldPassword: string, newPassword: string) : void {
        throw new Error("Not implemented.");
    }

    private isNode() {
        let isNode = false;
        try {
            isNode = process != undefined;
        } catch (e) {}
        return isNode;
    }

    set sessionKey(value: SessionKey) {
        if(!this.isNode()) {
            window.localStorage.setItem('sessionKey', JSON.stringify(value));
        }
    }

    get sessionKey() : SessionKey {
        if(!this.isNode()) {
            let sessionKey = localStorage.getItem('sessionKey');
            if (sessionKey !== null && sessionKey) {
                return JSON.parse(sessionKey) as SessionKey;
            }
        }
        // @ts-ignore
        return null;
    }
}

const Config = new Configuration();
// @ts-ignore
window.Config = Config;

export { Config };