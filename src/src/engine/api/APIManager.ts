import {Logger} from "../Logger";

import {FirebaseApp, initializeApp} from "firebase/app";
import {Analytics, getAnalytics} from "firebase/analytics";

import * as FirebaseAuth from "firebase/auth";
import {addDoc, doc, Firestore, getFirestore, setDoc} from "firebase/firestore";
import {FirebasePerformance, getPerformance} from "firebase/performance";
import {firebaseConfig} from "./config/FirebaseConfig";
import {EmployeeCreateDTO} from "../types/Employee";
import {Errors} from "./errors/Errors";

class APIManager extends Logger {
    public moduleName: string = "APIManager";
    public logColor: string = "#8a894a";

    // @ts-ignore
    #app: FirebaseApp;
    // @ts-ignore
    #analytics: Analytics;
    // @ts-ignore
    #auth: FirebaseAuth.Auth;
    // @ts-ignore
    #performance: FirebasePerformance;
    // @ts-ignore
    #db: Firestore;
    #userInfo: FirebaseAuth.UserCredential | null = null;
    #user: FirebaseAuth.User | null = null;

    private isAuthenticated: boolean = false;

    public awaitLogin: Promise<void> | undefined;
    private subscribers: Array<() => void> = [];

    constructor() {
        super();

        this.loadFirebase();
    }

    public getEmployeeName(): string {
        return this.#user?.displayName || this.#user?.email || "Unknown";
    }

    private onEvent(): void {
        for (let subscriber of this.subscribers) {
            subscriber();
        }
    }

    public subscribeToEvent(subscriber: () => void): void {
        this.subscribers.push(subscriber);
    }

    public isAuth(): boolean {
        return this.isAuthenticated;
    }

    public async loginWithPassword(email: string, password: string): Promise<FirebaseAuth.UserCredential> {
        await API.awaitLogin;

        return new Promise(async (resolve, reject) => {
            let userCredentials = await FirebaseAuth.signInWithEmailAndPassword(this.#auth, email, password).catch((e) => {
                this.error(`Error while logging in: ${e}`);
            });

            if (userCredentials !== null && userCredentials) {
                console.log('credentials', userCredentials);

                if (userCredentials.user !== null && userCredentials.user) {
                    this.#user = userCredentials.user;
                }

                this.isAuthenticated = true;
                resolve(userCredentials);
            } else {
                reject(Errors.USER_NOT_FOUND);
            }

            this.onEvent();
        });
    }

    public async resetPassword(email: string): Promise<boolean> {
        let sentWithoutErrors = true;
        await FirebaseAuth.sendPasswordResetEmail(this.#auth, email).catch((e) => {
            this.error(e);

            sentWithoutErrors = false;
        });

        return sentWithoutErrors;
    }

    public async logout(): Promise<boolean> {
        if (this.isAuthenticated) {
            this.log('Logging out...');

            let exitWithoutErrors = true;
            await FirebaseAuth.signOut(this.#auth).catch((e) => {
                this.error(e);

                exitWithoutErrors = false;
            });

            if (exitWithoutErrors) this.onEvent();

            return exitWithoutErrors;
        } else {
            return false;
        }
    }

    private async verifyEmailAddress(user: FirebaseAuth.User): Promise<boolean> {
        let sentWithoutErrors = true;
        await FirebaseAuth.sendEmailVerification(user).catch((e) => {
            this.error(e);

            sentWithoutErrors = false;
        });

        return sentWithoutErrors;
    }

    private async listenEvents(): Promise<void> {
        let resolved = false;

        this.awaitLogin = new Promise(async (resolve, reject) => {
            FirebaseAuth.onAuthStateChanged(this.#auth, (user) => {
                this.log('Auth state changed!');

                if (user === null || !user) {
                    this.isAuthenticated = false;
                } else {
                    this.isAuthenticated = true;
                    this.#user = user;

                    console.log('user', user);
                }

                if (!resolved) {
                    resolved = true;
                    resolve();
                }
            });

            await FirebaseAuth.setPersistence(this.#auth, FirebaseAuth.browserSessionPersistence).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;

                this.error(`Error code: ${errorCode} - ${errorMessage}`);
            });
        });

        await this.awaitLogin;
    }

    private async loadFirebase(): Promise<void> {
        this.#app = initializeApp(firebaseConfig);
        this.#analytics = getAnalytics(this.#app);
        this.#auth = FirebaseAuth.getAuth(this.#app);
        this.#performance = getPerformance(this.#app);
        this.#db = getFirestore(this.#app);

        await this.listenEvents();
    }

    private elementExist(element: any): boolean {
        return element !== undefined && element !== null;
    }

    public async changePassword(oldPassword: string, newPassword: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const user = this.#auth.currentUser;

            if (user !== null && user) {
                if (this.elementExist(user.email)) {
                    let email = user.email || '';

                    const credential = FirebaseAuth.EmailAuthProvider.credential(email, oldPassword);

                    let isOk = await FirebaseAuth.updatePassword(user, newPassword).catch((e) => {
                        this.error(e);
                        reject(e);
                    });

                    console.log('change password', isOk);

                    // Prompt the user to re-provide their sign-in credentials
                    let reAuth = await FirebaseAuth.reauthenticateWithCredential(user, credential).catch((e) => {
                        this.error(e);
                        reject(e);
                    });

                    console.log('reauth', reAuth);
                } else {
                    reject(Errors.EMAIL_NOT_FOUND);
                }
            } else {

            }


        });
    }

    public async createEmployee(email: string, password: string, employee: EmployeeCreateDTO): Promise<boolean> {
        return new Promise(async (resolve) => {
            let userCreated = true;
            let userCredentials: void | FirebaseAuth.UserCredential = await FirebaseAuth.createUserWithEmailAndPassword(this.#auth, email, password).then(async () => {
                if (this.#auth.currentUser) {
                    await setDoc(doc(this.#db, `employees`, this.#auth.currentUser.uid), {...employee}).catch((e) => {
                        this.error(e);
                    })
                }
            }).catch((e) => {
                this.error(e);
                userCreated = false;
            });


            /*this.#db.createUser({
                email: 'user@example.com',
                emailVerified: false,
                phoneNumber: '+11234567890',
                password: 'secretPassword',
                displayName: 'John Doe',
                photoURL: 'http://www.example.com/12345678/photo.png',
                disabled: false,
            })*/

            resolve(userCreated);
        });
    }
}

export const API = new APIManager;

// @ts-ignore
window.API = API;

