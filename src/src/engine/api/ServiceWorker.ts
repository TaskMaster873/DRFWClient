import { Logger } from "../Logger";
import { AccountCreationData, CreatedAccountData, ThreadMessage, ThreadMessageType } from "./types/ThreadMessage";
import { FirebaseApp, initializeApp } from "firebase/app";
import { FIREBASE_AUTH_EMULATOR_PORT, firebaseConfig } from "./config/FirebaseConfig";
import * as FirebaseAuth from "firebase/auth";
import { connectAuthEmulator } from "firebase/auth";
import { Employee } from "../types/Employee";

class TaskMasterServiceWorker extends Logger {
    public moduleName: string = 'TaskMasterServiceWorker';
    public logColor: string = `#0ebccb`;
    private emulatorLoaded: boolean = false;

    // @ts-ignore
    #app: FirebaseApp;
    // @ts-ignore
    #auth: FirebaseAuth.Auth;

    constructor() {
        super();

        this.init();
    }

    public async init() : Promise<void> {
        this.log(`Initializing TaskMasterServiceWorker.`);

        this.listenToMessages();
    }

    private listenToMessages() : void {
        this.log(`Listening to messages.`);

        self.onmessage = this.onMessage.bind(this);
    }

    private async onMessage(message: MessageEvent) : Promise<void> {
        let data = message.data as ThreadMessage;

        this.log(`Received message from main thread.`);

        switch(data.type) {
            case ThreadMessageType.INIT: {
                await this.createFirebaseApp();
                break;
            }

            case ThreadMessageType.CREATE_NEW_ACCOUNT: {
                await this.createNewAccount(data.taskId, data.data);
                break;
            }

            default: {
                this.warn(`Unknown message type ${data.type}.`);
            }
        }
    }

    private async postMessage(message: ThreadMessage) : Promise<void> {
        await self.postMessage(message);
    }

    private async createNewAccount(taskId: string | null, data: AccountCreationData) : Promise<void> {
        this.log(`Creating new account for task ${taskId}`);

        let employee: Employee = data.employee;

        let errorMessage: string | null = null;
        let createdUser = await FirebaseAuth.createUserWithEmailAndPassword(
            this.#auth,
            employee.email,
            data.password
        ).catch((error: FirebaseAuth.AuthError) => {
            errorMessage = error.message;
        });

        let responseData: CreatedAccountData = {};
        if (errorMessage) {
            responseData.error = errorMessage;
        } else if(createdUser) {
            responseData = {
                createdUser: {
                    userId: createdUser?.user?.uid
                }
            };
        } else {
            responseData.error = "Unknown error.";
        }

        let response: ThreadMessage = {
            type: ThreadMessageType.TASK_RESPONSE,
            taskId: taskId,
            data: responseData
        };

        await this.postMessage(response);
    }

    private async enablePersistence(): Promise<void> {
        await FirebaseAuth.setPersistence(this.#auth, FirebaseAuth.inMemoryPersistence).catch((error) => {
            // Handle Errors here.
            const errorCode = error;
            const errorMessage = error.message;

            this.error(`Error code: ${errorCode} - ${errorMessage}`);
        });
    }

    private async createFirebaseApp() : Promise<void> {
        let start = Date.now();
        this.log(`Creating Firebase app.`);

        this.#app = initializeApp(firebaseConfig);
        this.#auth = FirebaseAuth.getAuth(this.#app);

        if (location.hostname === "localhost" && !this.emulatorLoaded) {
            this.emulatorLoaded = true;
            connectAuthEmulator(this.#auth, "http://localhost:" + FIREBASE_AUTH_EMULATOR_PORT);

            this.log("Firebase emulators loaded");
        }

        await this.enablePersistence();

        this.log(`Firebase loaded successfully after ${Date.now() - start}ms.`);
    }
}

new TaskMasterServiceWorker;

export {};
