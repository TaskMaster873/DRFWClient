
class Configuration {
    readonly connectionURIRemote: string = '';
    readonly connectionURILocal: string = 'localhost';

    readonly connectionPort: number = 9002;
    readonly connectionPath: string = '/ws';

    readonly apiPath: string = 'api/v1';
    readonly schemaAPIPath: string = `/schema`;

    async resetAuthKey() {
        localStorage.removeItem('authKey');
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

export const Config = new Configuration();