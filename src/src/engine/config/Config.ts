import { Buffer } from 'buffer';

class Configuration {
    readonly connectionURIRemote: string = '';
    readonly connectionURILocal: string = 'localhost';

    readonly connectionPort: number = 9002;
    readonly connectionPath: string = '/ws';

    readonly apiPath: string = 'api/v1';
    readonly schemaAPIPath: string = `/schema`;

    public resetAuthKey() {
        localStorage.removeItem('authKey');
    }

    public loginWithPassword(username: string, password: string) : void {
        throw new Error("Not implemented.");
    }

    set authKey(authKey: Buffer) {
        console.log('set auth key', authKey);
        localStorage.setItem('authKey', authKey.toString('base64'));
    }

    set clientHash(clientHash: string) {
        localStorage.setItem('clientHash', clientHash);
    }

    set clientId(clientId: string) {
        localStorage.setItem('clientId', clientId);
    }

    get clientId() : string {
        let clientId = localStorage.getItem('clientId');

        if(clientId !== null && clientId) {
            return clientId;
        } else {
            // @ts-ignore
            return null;
        }
    }

    get getClientAuthKey() : Buffer {
        let authKey = localStorage.getItem('authKey');

        if(authKey !== null && authKey) {
            let buf = Buffer.from(authKey, 'base64');
            buf = buf.slice(96, 160);

            return buf;
        } else {
            // @ts-ignore
            return null;
        }
    }

    get clientHash() : string {
        let clientHash = localStorage.getItem('clientHash');

        if(clientHash !== null && clientHash) {
            return clientHash;
        } else {
            // @ts-ignore
            return null;
        }
    }

    get authKey() : Buffer {
        let authKey = localStorage.getItem('authKey');

        if(authKey !== null && authKey) {
            return Buffer.from(authKey, 'base64');
        } else {
            // @ts-ignore
            return null;
        }
    }
}

const Config = new Configuration();
// @ts-ignore
window.Config = Config;

export { Config };