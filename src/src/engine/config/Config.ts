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

    /**
     * NOT USED HERE, GO TO SAME NAME METHOD IN WebSocketManager.TS
     * @param username 
     * @param password 
     */
    public loginWithPassword(username: string, password: string) : void {
        throw new Error("Not implemented.");
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

    set authKey(authKey: Buffer) {
        if(!this.isNode()) {
            window.localStorage.setItem('authKey', authKey.toString('base64'));
        }
    }

    get authKey() : Buffer {
        if(!this.isNode()) {
            let authKey = localStorage.getItem('authKey');

            if (authKey !== null && authKey) {
                return Buffer.from(authKey, 'base64');
            }
        }

        // @ts-ignore
        return null;
    }

    set clientHash(clientHash: string) {
        if(!this.isNode()) window.localStorage.setItem('clientHash', clientHash);
    }

    get clientHash() : string {
        if(!this.isNode()) {
            let clientHash = localStorage.getItem('clientHash');

            if (clientHash !== null && clientHash) {
                return clientHash;
            }
        }

        // @ts-ignore
        return null;
    }

    set clientId(clientId: string) {
        if(!this.isNode()) window.localStorage.setItem('clientId', clientId);
    }

    get clientId() : string {
        if(!this.isNode()) {
            let clientId = window.localStorage.getItem('clientId');

            if(clientId !== null && clientId) {
                return clientId;
            }
        }

        // @ts-ignore
        return null;
    }

    get getClientAuthKey() : Buffer {
        if(!this.isNode()) {
            let authKey = localStorage.getItem('authKey');

            if (authKey !== null && authKey) {
                let buf = Buffer.from(authKey, 'base64');
                buf = buf.slice(96, 160);

                return buf;
            }
        }

        //@ts-ignore
        return null;
    }
}

const Config = new Configuration();
// @ts-ignore
window.Config = Config;

export { Config };