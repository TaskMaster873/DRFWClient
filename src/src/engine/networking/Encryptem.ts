import {Logger} from "../Logger";
import {Config} from "../config/Config";
import { Buffer } from "buffer";
import * as sodium from 'sodium-universal';
import * as crypto from "crypto";

export class Encryptem extends Logger {
    public moduleName: string = 'Encryptem';
    public logColor: string = `#1af69a`;

    private started: boolean = false;
    private sodium: any = null;

    // @ts-ignore
    #clientSecretKey: Buffer = null;
    // @ts-ignore
    #clientPublicKey: Buffer = null;

    // @ts-ignore
    #clientSignaturePublicKey: Buffer = null;
    // @ts-ignore
    #clientSignaturePrivateKey: Buffer = null;

    // @ts-ignore
    #serverPublicKey: Buffer = null;
    // @ts-ignore
    #serverSignaturePublicKey: Buffer = null;

    // @ts-ignore
    #authSecretKey: Buffer = null;

    constructor() {
        super();

        this.init();
    }

    public setClientSecretKey(key: Buffer) : void {
        this.#clientSecretKey = key;
    }

    public setClientPublicKey(key: Buffer) : void {
        this.#clientPublicKey = key;
    }

    public setClientSignaturePublicKey(key: Buffer) : void {
        this.#clientSignaturePublicKey = key;
    }

    public setClientSignaturePrivateKey(key: Buffer) : void {
        this.#clientSignaturePrivateKey = key;
    }
    public setServerSignaturePublicKey(key: Buffer) : void {
        this.#serverSignaturePublicKey = key;
    }

    public setServerPublicKey(key: Buffer) : void {
        this.#serverPublicKey = key;
    }

    public setClientAuthKey(key: Buffer) : void {
        this.#authSecretKey = key;
    }

    public getClientPublicKey() : Buffer {
        return this.#clientPublicKey;
    }

    public getClientSignaturePublicKey() : Buffer {
        return this.#clientSignaturePublicKey;
    }

    public getServerPublicKey() : Buffer {
        return this.#serverPublicKey;
    }

    public getServerSignaturePublicKey() : Buffer {
        return this.#serverSignaturePublicKey;
    }

    public setSodium(sodium: any) : void {
        this.sodium = sodium;
    }

    private generateNonce() : Buffer {
        let keyBuf = Buffer.alloc(this.sodium.crypto_box_NONCEBYTES);
        this.sodium.randombytes_buf(keyBuf);
        return keyBuf;
    }

    #encrypt(m: Buffer, receiverPublicKey: Buffer, senderPrivateKey: Buffer, senderPublicKey: Buffer, senderSigningPrivateKey: Buffer) : Uint8Array {
        try {
            let nonce = this.generateNonce();
            let cipherMsg = Buffer.alloc(m.length + this.sodium.crypto_box_MACBYTES);

            this.sodium.crypto_box_easy(cipherMsg, m, nonce, receiverPublicKey, senderPrivateKey);

            let finalMsg = Buffer.concat([nonce, cipherMsg]);
            let signedMessage = this.#signMessageV2(cipherMsg, senderPublicKey, senderSigningPrivateKey);
            if(signedMessage === null) {
                throw new Error(`Failed to sign message.`);
                // @ts-ignore
                return null;
            }

            let auth = this.#authenticate(signedMessage);
            let finalMessageBuffer = Buffer.concat([auth, signedMessage, finalMsg]);

            return new Uint8Array(finalMessageBuffer);
        } catch(e: any) {
            console.error(e.stack);
        }

        // @ts-ignore
        return null;
    }

    #decrypt(msg: Buffer, senderPublicKey: Buffer, receiverPrivateKey: Buffer, signature: Buffer, senderSigningPublicKey: Buffer) : Buffer {
        if (msg.length < this.sodium.crypto_box_NONCEBYTES + this.sodium.crypto_box_MACBYTES) {
            throw "Short message";
        }

        let nonce = msg.slice(0, this.sodium.crypto_box_NONCEBYTES);
        let cipher = msg.slice(this.sodium.crypto_box_NONCEBYTES);

        let decryptedMessage = Buffer.alloc(cipher.length - this.sodium.crypto_box_MACBYTES);
        this.sodium.crypto_box_open_easy(decryptedMessage, cipher, nonce, senderPublicKey, receiverPrivateKey);

        let verified = this.#verifySignature(cipher, signature, senderSigningPublicKey);
        if(verified) {
            return decryptedMessage;
        } else {
            // @ts-ignore
            return null;
        }
    }

    #authenticate(input: Buffer) : Buffer {
        let out = Buffer.alloc(this.sodium.crypto_auth_BYTES);
        let k = Buffer.alloc(this.sodium.crypto_auth_KEYBYTES);
        this.sodium.randombytes_buf(k);

        this.sodium.crypto_auth(out, input, k);

        return out;
    }

    #verifySignature(m: Buffer, signature: Buffer, publicKey: Buffer) : boolean {
        if(m !== null && m) {
            try {
                let signed = this.sodium.crypto_sign_verify_detached(signature, m, publicKey); //this.sodium.crypto_sign_open(m, signature, publicKey);

                return signed;
            } catch(e) {
                return false;
            }
        } else {
            return false;
        }
    }

    #signMessageV2(m: Buffer, publicSignKey: Buffer, privateKey: Buffer) : Buffer {
        let signedLength = this.sodium.crypto_sign_BYTES;
        let signedMessageBuffer = Buffer.alloc(signedLength);

        this.sodium.crypto_sign_detached(signedMessageBuffer, m, privateKey);

        let signed: boolean = this.#verifySignature(m, signedMessageBuffer, publicSignKey);
        if(!signed) {
            // @ts-ignore
            return null;
        }

        return signedMessageBuffer;
    }

    private async generateSignatureSeededKeyPairs(password: string) : Promise<{publicKey: Buffer, privateKey: Buffer}> {
        let publicKey = Buffer.allocUnsafe(this.sodium.crypto_sign_PUBLICKEYBYTES);
        let privateKey = Buffer.allocUnsafe(this.sodium.crypto_sign_SECRETKEYBYTES);

        let seed = this.generateBytes(password);

        this.sodium.crypto_sign_seed_keypair(publicKey, privateKey, seed);

        return {
            publicKey,
            privateKey
        };
    }

    private async generateNewCipherKey() : Promise<{publicKey: Buffer, privateKey: Buffer}> {
        let publicKey = Buffer.alloc(this.sodium.crypto_box_PUBLICKEYBYTES);
        let privateKey = Buffer.alloc(this.sodium.crypto_box_PUBLICKEYBYTES);

        this.sodium.crypto_box_keypair(publicKey, privateKey);

        return {
            publicKey,
            privateKey
        }
    }

    private getAuthKey() : Buffer {
        return Buffer.concat([this.#clientSignaturePrivateKey, this.#clientSignaturePublicKey, this.#authSecretKey]);
    }

    private async generateSHA256(str: string) : Promise<string> {
        const buffer = Buffer.from(str);

        let hash = await crypto.subtle.digest('SHA-256', buffer);
        let result = '';

        const view = new DataView(hash);
        for (let i = 0; i < hash.byteLength; i += 4) {
            result += ('00000000' + view.getUint32(i).toString(16)).slice(-8);
        }

        return result;
    }

    public loadClientKeys() : void {
        let authKey = Config.authKey;

        if(authKey !== null && authKey) {
            let publicKey = Config.authKey.slice(64, 96);
            let privateKey = Config.authKey.slice(0, 64);
            let authSecret = Config.authKey.slice(96, 160);

            this.setClientSignaturePublicKey(publicKey);
            this.setClientSignaturePrivateKey(privateKey);
            this.setClientAuthKey(authSecret);
        }
    }

    public async generateClientCipherKeyPair(password: string) : Promise<void> {
        let hashedPwd = await this.generateSHA256(password);
        Config.clientHash = hashedPwd;

        let keys = await this.generateNewCipherKey();

        this.setClientPublicKey(keys.publicKey);
        this.setClientSecretKey(keys.privateKey);

        let signatureSeededKeyPairs = await this.generateSignatureSeededKeyPairs(password);
        this.#clientSignaturePublicKey = signatureSeededKeyPairs.publicKey;
        this.#clientSignaturePrivateKey = signatureSeededKeyPairs.privateKey;

        let signedPassword = await this.#signMessageV2(Buffer.from(hashedPwd), this.#clientSignaturePublicKey, this.#clientSignaturePrivateKey);
        console.log(`Signed Password: ${signedPassword}`);

        this.#authSecretKey = signedPassword;

        // @ts-ignore
        this.#serverSignaturePublicKey = null;

        Config.authKey = this.getAuthKey();
    }

    public startEncryption() : void {
        this.started = true;

        this.log(`!! -- Encryption started. Handshake completed successfully. -- !!`);
    }

    public encrypt(msg: Uint8Array) : Uint8Array {
        if(!this.started) {
            return msg;
        } else {
            let encryptedBuffer = this.#encrypt(Buffer.from(msg), this.#serverPublicKey, this.#clientSecretKey, this.#clientSignaturePublicKey, this.#clientSignaturePrivateKey);
            if(encryptedBuffer !== null) {
                return encryptedBuffer;
            } else {
                throw new Error("Encryption failed.");
            }
        }
    }

    public stringHash(str: string) : number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash &= hash;
        }
        return hash;
    }

    public generateBytes(seed: string) {
        const result = new Uint8Array(32);
        const hash = this.stringHash(seed);
        const used = new Set();

        for (let i = 0; i < 32; i++) {
            let next = (hash >> (8 * i)) & 0xff;
            while (used.has(next)) {
                next = (next + 1) & 0xff;
            }
            used.add(next);
            result[i] = next;
        }

        return result;
    }

    public decrypt(msg: Uint8Array) : Uint8Array {
        if(!this.started) {
            return msg;
        } else {
            let auth = Buffer.from(msg.slice(0, this.sodium.crypto_auth_BYTES));
            let signature = Buffer.from(msg.slice(auth.length, auth.length+64));
            let data = Buffer.from(msg.slice(auth.length+64, msg.length));

            try {
                let decryptedBuffer = this.#decrypt(data, this.#serverPublicKey, this.#clientSecretKey, signature, this.#serverSignaturePublicKey);
                if(decryptedBuffer !== null) {
                    msg = decryptedBuffer;
                }
            } catch(e: any) {
                this.error(`Decryption failed.`);
                console.log(e.stack);
            }

            return msg;
        }
    }

    public reset() : void {
        this.started = false;

        // @ts-ignore
        this.#clientSecretKey = null;
        // @ts-ignore
        this.#clientPublicKey = null;

        // @ts-ignore
        this.#clientSignaturePublicKey = null;
        // @ts-ignore
        this.#clientSignaturePrivateKey = null;

        // @ts-ignore
        this.#serverPublicKey = null;
        // @ts-ignore
        this.#serverSignaturePublicKey = null;

        this.loadClientKeys();
    }

    private init() : void {
        this.sodium = sodium;
        this.reset();
    }
}