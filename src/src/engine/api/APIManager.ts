import {Logger} from "../Logger";

import {FirebaseApp, initializeApp} from "firebase/app";
import {Analytics, getAnalytics, isSupported} from "firebase/analytics";

import * as FirebaseAuth from "firebase/auth";
import {
    confirmPasswordReset,
    connectAuthEmulator,
    verifyPasswordResetCode,
} from "firebase/auth";
import {
    addDoc,
    collection,
    connectFirestoreEmulator,
    doc,
    DocumentData,
    enableIndexedDbPersistence,
    Firestore,
    getDoc,
    getDocs,
    getFirestore,
    query,
    QueryDocumentSnapshot,
    QuerySnapshot,
    setDoc,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore";

import {FirebasePerformance, getPerformance} from "firebase/performance";
import {FIREBASE_AUTH_EMULATOR_PORT, firebaseConfig, FIRESTORE_EMULATOR_PORT} from "./config/FirebaseConfig";
import {Employee, EmployeeCreateDTO, EmployeeEditDTO, EmployeeJobTitleList, EmployeeRoleList} from "../types/Employee";
import {Department, DepartmentModifyDTO} from "../types/Department";
import {Shift} from "../types/Shift";
import {errors} from "../messages/APIMessages";
import {
    CreatedAccountData,
    Task,
    ThreadMessage,
    ThreadMessageType,
} from "./types/ThreadMessage";

import {Roles} from "../types/Roles";
import {DayPilot} from "@daypilot/daypilot-lite-react";
import {department} from "../../../Constants/testConstants";

type SubscriberCallback =
    () =>
        | void
        | (() => Promise<void>)
        | PromiseLike<void>;

/**
 * The APIManager is responsible for all communication with the Firebase API.
 * It is a singleton class, this allows us to have a single instance of the APIManager and use it throughout the application.
 * This class is also responsible for handling the authentication of the user.
 * @class APIManager
 * @extends Logger
 * @property {string} moduleName - The name of the module.
 * @property {string} logColor - The color of the log messages.
 * @property {FirebaseApp} #app - The FirebaseApp instance.
 * @property {Analytics} #analytics - The Analytics instance.
 * @property {FirebaseAuth.Auth} #auth - The FirebaseAuth instance.
 * @property {FirebasePerformance} #performance - The FirebasePerformance instance.
 * @property {Firestore} #db - The Firestore instance.
 * @property {FirebaseAuth.User | null} #user - The current user.
 * @property {number} #userRole - The current user's role.
 * @property {Worker | null} #worker - The worker thread used to create users.
 * @property {boolean} emulatorLoaded - Whether the emulator has been loaded.
 * @property {boolean} isAuthenticated - Whether the user is authenticated.
 * @property {Promise<void> | undefined} awaitLogin - A promise that resolves when the user is authenticated.
 * @property {Array<SubscriberCallback>} subscribers - An array of callbacks that are called when the user is authenticated.
 * @property {Map<string, Task>} tasks - A map of tasks that are currently being executed.
 */
class APIManager extends Logger {
    public moduleName: string = "APIManager";
    public logColor: string = "#8a894a";

    /**
     * Firebase related properties.
     */
    #app!: FirebaseApp;
    #analytics!: Analytics;
    #auth!: FirebaseAuth.Auth;
    #performance!: FirebasePerformance;
    #db!: Firestore;

    #user: FirebaseAuth.User | null = null;
    #userRole: number = 0;

    /**
     * Global variables of APIManager.
     * @private
     */
    #worker: Worker | null = null;

    private emulatorLoaded: boolean = false;
    private isAuthenticated: boolean = false;

    public awaitLogin: Promise<void> | undefined;
    private subscribers: Array<SubscriberCallback> = [];

    private tasks: Map<string, Task> = new Map<string, Task>();

    constructor() {
        super();

        this.loadFirebase();

        // Stupid JEST doesn't support web workers.
        try {
            if (process === null || process === undefined) {
                this.registerServiceWorker();
            }
        } catch (e) {
            this.registerServiceWorker();
        }
    }

    //#region GETTERS
    /**
     * Return the current user role.
     * @readonly
     * @type {number}
     * @memberof APIManager
     * @returns {number} The current user role.
     */
    public get userRole(): number {
        return this.#userRole;
    }

    /**
     * This method return the current employee name.
     * @readonly
     * @type {string}
     * @memberof APIManager
     * @returns {string} The current employee name.
     */
    public getEmployeeName(): string {
        return this.#user?.displayName || this.#user?.email || "Anonyme";
    }

    /**
     * This method return if the user is authenticated or not.
     * @returns {boolean} True if the user is authenticated, false otherwise.
     * @memberof APIManager
     * @method isAuth
     */
    public isAuth(): boolean {
        return this.isAuthenticated;
    }

    /**
     * This method return if the current user has the given permissions.
     * @param permissionLevel The permission level to check.
     * @returns {boolean} True if the user has the given permissions, false otherwise.
     */
    public hasPermission(permissionLevel: Roles): boolean {
        return this.#userRole >= permissionLevel;
    }

    /**
     * This method return if the current user has a lower permission than the given one.
     * @param permissionLevel The permission level to check.
     * @returns {boolean} True if the user has a lower permission than the given one, false otherwise.
     */
    public hasLowerPermission(permissionLevel: Roles): boolean {
        return this.#userRole > permissionLevel;
    }

    //#endregion

    /**
     * Create a new service worker and listen for messages.
     * @private
     * @async
     * @method registerServiceWorker
     * @returns {Promise<void>}
     * @memberof APIManager
     */
    private async registerServiceWorker(): Promise<void> {
        try {
            const worker = new Worker(
                new URL("./ServiceWorker.ts", import.meta.url)
            );

            let initMessage: ThreadMessage = {
                type: ThreadMessageType.INIT,
                taskId: null,
            };

            worker.postMessage(initMessage);

            this.#worker = worker;
            this.listenWorkerEvents();
        } catch (e: any) {
            this.error(e.message);
        }
    }

    /**
     * This function is used to process the messages received from the web worker.
     * @param message
     * @private
     * @async
     * @method onWorkerMessage
     * @returns {Promise<void>}
     */
    private async onWorkerMessage(message: MessageEvent): Promise<void> {
        let data = message.data as ThreadMessage;

        switch (data.type) {
            case ThreadMessageType.TASK_RESPONSE: {
                await this.onTaskResponse(data.taskId, data.data);
                break;
            }

            default: {
                this.warn(`[MAIN] Unknown message type ${data.type}.`);
            }
        }
    }

    /**
     * Used to generate unique task IDs for the web worker.
     * @private
     */
    private generateTaskId(): string {
        return Math.random().toString(36).substring(2);
    }

    /**
     * This function is used to send a message to the web worker to create a new user.
     * @param {EmployeeCreateDTO} employee The employee data of the new user.
     * @param {string} password The password of the new user.
     * @private
     * @async
     * @method requestUserCreationFromWorker
     * @returns {Promise<CreatedAccountData>}
     * @memberof APIManager
     */
    private requestUserCreationFromWorker(
        employee: EmployeeCreateDTO,
        password: string
    ): Promise<CreatedAccountData> {
        return new Promise((resolve) => {
            let taskId = this.generateTaskId();
            let createAccountMessage: ThreadMessage = {
                type: ThreadMessageType.CREATE_NEW_ACCOUNT,
                taskId: taskId,
                data: {
                    employee: employee,
                    password: password,
                },
            };

            let task: Task = {
                callback: resolve,
            };

            this.tasks.set(taskId, task);
            this.#worker?.postMessage(createAccountMessage);
        });
    }

    /**
     * This function is used to process the response from the web worker.
     * @param {string | null} taskId
     * @param {CreatedAccountData} data
     * @private
     * @async
     * @method onTaskResponse
     * @returns {Promise<void>}
     */
    private async onTaskResponse(
        taskId: string | null,
        data: CreatedAccountData
    ): Promise<void> {
        this.log(`Got response from worker for task ${taskId}`);

        let task = this.tasks.get(taskId || "");
        if (task) {
            task.callback(data);

            this.tasks.delete(taskId || "");
        } else {
            this.error(`Task ${taskId} not found.`);
        }
    }

    /**
     * Listen for messages from the web worker.
     * @private
     */
    private listenWorkerEvents(): void {
        if (this.#worker !== null && this.#worker) {
            this.#worker.onmessage = this.onWorkerMessage.bind(this);
        }
    }

    /**
     * This method call all the subscribers to the login/logout event.
     * @private
     */
    private async onEvent(): Promise<void> {
        for (let subscriber of this.subscribers) {
            await subscriber();
        }
    }

    /**
     * This method is used to subscribe to the login/logout event.
     * @param subscriber
     */
    public subscribeToEvent(subscriber: SubscriberCallback): void {
        this.subscribers.push(subscriber);
    }

    /**
     * This method parse firebase error codes and return a human-readable error message.
     * @param error The error to parse.
     * @returns {string} The human-readable error message.
     */
    private getErrorMessageFromCode(error: Error | string): string {
        let errorMessage: string;
        let message: string;

        if (typeof error === "string") {
            message = error;
        } else {
            message = error.message;
        }

        switch (message) {
            case "auth/invalid-email":
                errorMessage = errors.INVALID_LOGIN;
                break;
            case "auth/user-not-found":
                errorMessage = errors.INVALID_LOGIN;
                break;
            case "auth/wrong-password":
                errorMessage = errors.INVALID_LOGIN;
                break;
            case "permission-denied":
                errorMessage = errors.PERMISSION_DENIED;
                break;
            default:
                errorMessage = errors.DEFAULT;
                break;
        }
        this.error(
            `Erreur: ${errorMessage} Code: ${error} Message: ${message}`
        );
        return errorMessage;
    }

    /**
     * This method is used to authenticate the user with his email and password.
     * @param email The email to use.
     * @param password The password to use.
     * @returns {Promise<string | null>} The error message if an error occurred, null otherwise.
     * @memberof APIManager
     * @method loginWithPassword
     * @async
     * @public
     */
    public async loginWithPassword(
        email: string,
        password: string
    ): Promise<string | null> {
        await API.awaitLogin;

        let errorMessage: string | null = null;
        let userCredentials = await FirebaseAuth.signInWithEmailAndPassword(
            this.#auth,
            email,
            password
        ).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error);
        });

        if (userCredentials !== null && userCredentials) {
            console.log("credentials", userCredentials);

            if (userCredentials.user !== null && userCredentials.user) {
                this.#user = userCredentials.user;
            }

            this.isAuthenticated = true;
        }

        await this.onEvent();
        return errorMessage;
    }

    /**
     * This method send a reset password email to the given email.
     * @param email The email to send the reset password email to.
     * @returns {Promise<string | null>} The error message if an error occurred, null otherwise.
     * @memberof APIManager
     * @method sendResetPassword
     */
    public async sendResetPassword(email: string): Promise<string | null> {
        let errorMessage: string | null = null;
        await FirebaseAuth.sendPasswordResetEmail(this.#auth, email).catch(
            (error) => {
                errorMessage = this.getErrorMessageFromCode(error);
            }
        );

        return errorMessage;
    }

    /**
     * This method logout the current user.
     * @returns {Promise<string | null>} The error message if an error occurred, null otherwise.
     * @memberof APIManager
     * @method logout
     */
    public async logout(): Promise<string | null> {
        this.log("Logging out user...");
        let errorMessage: string | null = null;

        if (this.isAuth()) {
            await FirebaseAuth.signOut(this.#auth).catch((error) => {
                errorMessage = this.getErrorMessageFromCode(error);
            });

            this.#userRole = -1;

            await this.onEvent();
        }

        return errorMessage;
    }

    /**
     * This method is used to trigger an email verification.
     * @param user The user to verify.
     * @private
     * @returns {Promise<string | null>} The error message if an error occurred, null otherwise.
     * @memberof APIManager
     * @method verifyEmailAddress
     * @async
     */
    private async verifyEmailAddress(
        user: FirebaseAuth.User
    ): Promise<string | null> {
        let errorMessage: string | null = null;
        await FirebaseAuth.sendEmailVerification(user).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error);
        });
        return errorMessage;
    }

    /**
     * This method is used to create all the listeners needed for the API and firebase.
     * @private
     * @memberof APIManager
     * @method listenEvents
     * @async
     * @returns {Promise<void>} Nothing.
     */
    private async listenEvents(): Promise<void> {
        let resolved = false;

        this.awaitLogin = new Promise(async (resolve) => {
            FirebaseAuth.onAuthStateChanged(
                this.#auth,
                async (user: FirebaseAuth.User | null) => {
                    this.log("Auth state changed!");

                    if (user === null || !user) {
                        this.isAuthenticated = false;
                    } else {
                        this.isAuthenticated = true;
                        this.#user = user;
                        this.#userRole = await this.getCurrentEmployeeRole(
                            user.uid
                        );

                        console.log("user", user);
                        console.log("userRole", this.#userRole);
                    }

                    if (!resolved) {
                        resolved = true;
                        resolve();
                    }
                }
            );
        });

        await this.awaitLogin;
        this.log("Login resolved!");
    }

    /**
     * This method is used to enable the browser session persistence.
     * @private
     * @memberof APIManager
     * @method enablePersistence
     * @async
     * @returns {Promise<void>} Nothing.
     */
    private async enablePersistence(): Promise<void> {
        await FirebaseAuth.setPersistence(
            this.#auth,
            FirebaseAuth.browserSessionPersistence
        ).catch((error) => {
            // Handle Errors here.
            const errorCode = error;
            const errorMessage = error.message;

            this.error(`Error code: ${errorCode} - ${errorMessage}`);
        });
    }

    /**
     * This method is used to load the firebase sdk. It also initializes everything related to the emulator when needed.
     * @private
     * @memberof APIManager
     * @method loadFirebase
     * @async
     * @returns {Promise<void>} Nothing.
     */
    private async loadFirebase(): Promise<void> {
        this.#app = initializeApp(firebaseConfig);

        this.#auth = FirebaseAuth.getAuth(this.#app);
        let loginAwait = this.listenEvents();

        this.#performance = getPerformance(this.#app);
        this.#db = getFirestore(this.#app);

        if ("indexedDB" in window) {
            if (
                "location" in window &&
                location &&
                location.hostname === "localhost" &&
                !this.emulatorLoaded
            ) {
                this.emulatorLoaded = true;
                connectAuthEmulator(
                    this.#auth,
                    "http://localhost:" + FIREBASE_AUTH_EMULATOR_PORT
                );
                connectFirestoreEmulator(
                    this.#db,
                    "localhost",
                    FIRESTORE_EMULATOR_PORT
                );

                if (!(this.#db as any)._firestoreClient) {
                    await enableIndexedDbPersistence(this.#db).catch((err) =>
                        console.log(err.message)
                    );
                    this.log("IndexedDB persistence enabled");
                }

                this.log("Firebase emulators loaded");
            }

            await this.enablePersistence();
        }

        let isAnalyticsSupported = await isSupported();
        if (isAnalyticsSupported) {
            this.#analytics = getAnalytics(this.#app);
        }

        this.log("Firebase loaded");
        await loginAwait;
    }

    /**
     * This method is used to verify that an element is not null or undefined.
     * @param element The element to verify.
     * @private
     * @returns {boolean} True if the element is not null or undefined, false otherwise.
     */
    private elementExist(element: any): boolean {
        return element !== undefined && element !== null;
    }

    /**
     * This method is used to verify the reset password code.
     * @param actionCode The reset password code.
     * @private
     * @returns {Promise<string | false>} The email address if the code is valid, false otherwise.
     */
    public async verifyResetPassword(
        actionCode: string
    ): Promise<string | false> {
        let errorMessage: string | null = null;
        let email = await verifyPasswordResetCode(this.#auth, actionCode).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error);
        });

        return (errorMessage || !email) ? false : email;
    }

    /**
     * This method is used to apply the new password to the account.
     * @param actionCode The reset password code.
     * @param newPassword The new password.
     * @returns {Promise<string | null>} Null if the reset password was successful, and the error message if it was not.
     * @memberof APIManager
     * @method applyResetPassword
     * @async
     * @public
     */
    public async applyResetPassword(
        actionCode: string,
        newPassword: string
    ): Promise<string | null> {
        let errorMessage: string | null = null;
        await confirmPasswordReset(this.#auth, actionCode, newPassword).catch(
            (error) => {
                errorMessage = this.getErrorMessageFromCode(error);
            }
        );
        return errorMessage;
    }

    /**
     * This method is used to change the password of the current user.
     * @param oldPassword The old password.
     * @param newPassword The new password.
     * @returns {Promise<string | null>} Null if the password was changed successfully, and the error message if it was not.
     * @memberof APIManager
     * @method changePassword
     * @async
     * @public
     */
    public async changePassword(
        oldPassword: string,
        newPassword: string
    ): Promise<string | null> {
        let errorMessage: string | null = null;
        const user = this.#auth.currentUser;
        if (user !== null && user) {
            if (this.elementExist(user.email)) {
                let email = user.email || "";

                const credential = FirebaseAuth.EmailAuthProvider.credential(
                    email,
                    oldPassword
                );

                await FirebaseAuth.updatePassword(
                    user,
                    newPassword
                ).catch((error) => {
                    errorMessage = this.getErrorMessageFromCode(error);
                });

                if (!errorMessage) {
                    // Prompt the user to re-provide their sign-in credentials
                    let reAuth = await FirebaseAuth.reauthenticateWithCredential(
                        user,
                        credential
                    ).catch((error) => {
                        errorMessage = this.getErrorMessageFromCode(error);
                    });

                    this.#user = reAuth?.user || null;
                }
            }
        }

        return errorMessage;
    }

    /**
     * This method is used to create a new employee. This method calls the worker to create the user. If the user is created successfully, it will create the employee in the database.
     * @param password The password of the new employee.
     * @param employee The employee data.
     * @returns {Promise<string | null>} Null if the employee was created successfully, and the error message if it was not.
     * @memberof APIManager
     * @method createEmployee
     * @async
     * @public
     */
    public async createEmployee(
        password: string,
        employee: EmployeeCreateDTO
    ): Promise<string | null> {
        if (!this.hasPermission(Roles.ADMIN)) {
            return errors.PERMISSION_DENIED;
        }
        let errorMessage: string | null = null;
        let createdUserMessageData = await this.requestUserCreationFromWorker(
            employee,
            password
        );

        if (
            createdUserMessageData.error !== null &&
            createdUserMessageData.error
        ) {
            errorMessage = this.getErrorMessageFromCode(
                createdUserMessageData.error
            );
        } else {
            let userAuth = createdUserMessageData.createdUser;
            let userId = userAuth?.userId;

            if (userId !== null && userId !== undefined && userId) {
                await setDoc(doc(this.#db, `employees`, userId), {
                    ...employee,
                }).catch((error) => {
                    errorMessage = this.getErrorMessageFromCode(error);
                    // FIREBASE LIMITATION : We can't delete the user if it has been created. Because only connected users can delete them self.
                });
                // TODO: Send verification email on login until validated.
            } else {
                errorMessage = `Erreur inconnue lors de la création de l'employé.`;
            }
        }

        return errorMessage;
    }

    /**
     * This method is used to edit an employee.
     * @param employeeId The id of the employee to edit.
     * @param employee The employee data.
     * @method editEmployee
     * @async
     * @public
     * @memberof APIManager
     * @returns {Promise<string | null>} Null if the employee was edited successfully, and the error message if it was not.
     */
    public async editEmployee(employeeId: string, employee: EmployeeEditDTO): Promise<string | null> {
        if (!this.hasPermission(Roles.ADMIN)) {
            return errors.PERMISSION_DENIED;
        }
        let errorMessage: string | null = null;
        if (employeeId) {
            await updateDoc(doc(this.#db, `employees`, employeeId), {...employee}).catch((error) => {
                errorMessage = this.getErrorMessageFromCode(error);
            });
        } else {
            errorMessage = errors.INVALID_EMPLOYEE_ID;
        }
        return errorMessage;
    }

    /**
     * This method is used to change the activation status of an employee.
     * @param employee The employee to change the activation status.
     * @method changeEmployeeActivation
     * @async
     * @public
     * @memberof APIManager
     * @returns {Promise<string | null>} Null if the employee was edited successfully, and the error message if it was not.
     */
    public async changeEmployeeActivation(employee: Employee): Promise<string | null> {
        let errorMessage: string | null = null;

        if (employee.employeeId) {
            if (!this.hasPermission) {
                return errors.PERMISSION_DENIED;
            }
            await updateDoc(doc(this.#db, `employees`, employee.employeeId), {isActive: employee.isActive}).catch((error) => {
                errorMessage = this.getErrorMessageFromCode(error);
            });
        } else {
            errorMessage = errors.INVALID_EMPLOYEE_ID;
        }

        return errorMessage;
    }

    /**
     * This method is used to create a new department.
     * @param department The department data.
     * @method createDepartment
     * @async
     * @public
     * @memberof APIManager
     * @returns {Promise<string | null>} Null if the department was created successfully, and the error message if it was not.
     */
    public async createDepartment(
        department: DepartmentModifyDTO
    ): Promise<string | null> {
        if (!this.hasPermission) {
            return errors.PERMISSION_DENIED;
        }
        let queryDepartment = query(
            collection(this.#db, `departments`),
            where("name", "==", department.name)
        );
        let errorMessage = await this.checkIfAlreadyExists(
            queryDepartment,
            errors.DEPARTMENT_ALREADY_EXIST
        );
        if (!errorMessage) {
            await addDoc(collection(this.#db, `departments`), {
                ...department,
            }).catch((error) => {
                errorMessage = this.getErrorMessageFromCode(error);
            });
        }
        return errorMessage;
    }

    /**
     * This method is used to edit a department.
     * @param departmentId
     * @param department The department data.
     * @method editDepartment
     * @async
     * @public
     * @memberof APIManager
     * @returns {Promise<string | null>} Null if the department was edited successfully, and the error message if it was not.
     */
    public async editDepartment(departmentId: string, department: DepartmentModifyDTO): Promise<string | null> {
        if (!this.hasPermission(Roles.ADMIN)) {
            return errors.PERMISSION_DENIED;
        }
        let queryDepartment = query(
            collection(this.#db, `departments`),
            where("name", "==", department.name)
        );
        let errorMessage = await this.checkIfAlreadyExists(
            queryDepartment,
            errors.DEPARTMENT_ALREADY_EXIST
        );
        if(!errorMessage) {
            if (departmentId) {
                await updateDoc(doc(this.#db, `departments`, departmentId), {...department}).catch((error) => {
                    errorMessage = this.getErrorMessageFromCode(error);
                });
            } else {
                errorMessage = errors.INVALID_DEPARTMENT_ID;
            }
        }

        return errorMessage;
    }

    /**
     * Check if a document already exists.
     * @param query The query to check.
     * @param error The error message to return if the document already exists.
     * @method checkIfAlreadyExists
     * @async
     * @private
     * @memberof APIManager
     * @returns {Promise<string | null>} Null if the document does not exist, and the error message if it does.
     */
    private async checkIfAlreadyExists(query, error: string): Promise<string | null> {
        let errorMessage: string | null = null;
        let snaps = await getDocs(query).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error);
        });
        if (snaps && snaps.docs.length > 0) {
            errorMessage = error;
        }
        return errorMessage;
    }

    /**
     * This method is used to get all the employees. If a department is specified, it will only return the employees of that department.
     * @method getEmployees
     * @param department The department to get the employees from. If not specified, it will return all the employees.
     * @async
     * @public
     * @memberof APIManager
     * @returns {Promise<Employee[] | string>} The employees if the request was successful, and the error message if it was not.
     */
    public async getEmployees(department?: string): Promise<Employee[] | string> {
        let errorMessage: string | null = null;
        let employees: Employee[] = [];
        let queryDepartment = query(collection(this.#db, `employees`));

        if (department) {
            queryDepartment = query(
                collection(this.#db, `employees`),
                where("department", "==", department)
            );
        }

        let snaps = await getDocs(queryDepartment).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error);
        });

        if (snaps) {
            snaps.docs.forEach((doc: QueryDocumentSnapshot) => {
                let data = doc.data();
                employees.push(
                    new Employee({
                        employeeId: doc.id,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        isActive: data.isActive,
                        phoneNumber: data.phoneNumber,
                        department: data.department,
                        jobTitles: data.jobTitles,
                        skills: data.skills,
                        role: data.role,
                    })
                );
            });
        }
        return errorMessage ?? employees;
    }

    /**
     * This method is used to get an employee by its ID. If the employee does not exist, it will return an error message.
     * @param employeeId The ID of the employee.
     * @method getEmployeeById
     * @async
     * @public
     * @memberof APIManager
     * @returns {Promise<EmployeeEditDTO | string>} The employee if the request was successful, and the error message if it was not.
     */
    public async getEmployeeById(employeeId: string): Promise<EmployeeEditDTO | string> {
        let errorMessage: string | null = null;

        let snap = await getDoc(doc(this.#db, `employees`, employeeId)).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error);
        });

        if (snap && snap.exists()) {
            return snap.data() as EmployeeEditDTO;
        } else {
            errorMessage = errors.EMPLOYEE_NOT_FOUND;
        }
        return errorMessage;
    }

    /**
     * This method is used to get all the departments.
     * @method getDepartments
     * @async
     * @public
     * @memberof APIManager
     * @returns {Promise<Department[] | string>} The departments if the request was successful, and the error message if it was not.
     */
    public async getDepartments(): Promise<Department[] | string> {
        let errorMessage: string | null = null;
        let departments: Department[] = [];
        let queryDepartment = query(collection(this.#db, `departments`));
        let snaps = await getDocs(queryDepartment).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error);
        });

        if (snaps) {
            for (let doc of snaps.docs) {
                departments.push(
                    new Department({
                        departmentId: doc.id,
                        name: doc.data().name,
                        director: doc.data().director
                    })
                );
            }
        }

        return errorMessage ?? departments;
    }

    /**
     * This method is used to get the number of employees in each department.
     * @method getEmployeeNbDepartments
     * @param departments The departments to get the number of employees from.
     * @async
     * @public
     * @memberof APIManager
     * @returns {Promise<number[] | string>} The number of employees in each department if the request was successful, and the error message if it was not.
     */
    public async getEmployeeNbDepartments(
        departments: Department[]
    ): Promise<number[] | string> {
        return new Promise((resolve) => {
            let errorMessage: string | null = null;
            let employeeNb: number[] = [];

            let promises: Promise<void | QuerySnapshot<DocumentData>>[] = [];

            for (const department of departments) {
                let queryEmployees = query(
                    collection(this.#db, `employees`),
                    where("department", "==", department.name)
                );
                let snaps = getDocs(queryEmployees);

                promises.push(snaps);
            }

            Promise.all(promises).then((values) => {
                for (let snapId in values) {
                    let snaps = values[snapId];
                    if (snaps !== null && snaps) {
                        employeeNb.push(snaps.docs.length);
                    }
                }
            }).catch((error) => {
                errorMessage = this.getErrorMessageFromCode(error);
            }).finally(() => {
                resolve(errorMessage ?? employeeNb);
            });
        });
    }

    /**
     * This method is used to get the role list. If the request was not successful, it will return an error message.
     * @method getRoles
     * @async
     * @public
     * @memberof APIManager
     * @returns {Promise<EmployeeRoleList | string>} The roles if the request was successful, and the error message if it was not.
     */
    public async getRoles(): Promise<EmployeeRoleList | string> {
        let errorMessage: string | null = null;
        let roles: string[] = [];
        let queryDepartment = query(collection(this.#db, `roles`));
        let snaps = await getDocs(queryDepartment).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error);
        });

        if (snaps) {
            snaps.docs.forEach((doc: QueryDocumentSnapshot) => {
                roles.push(doc.data().name);
            });
        }

        return errorMessage ?? roles;
    }

    /**
     * This method is used to get the current employee's role. If the request was not successful, it will return an error message.
     * @param uid The ID of the employee.
     * @method getCurrentEmployeeRole
     * @async
     * @public
     * @memberof APIManager
     * @returns {Promise<number | string>} The role of the employee if the request was successful, and the error message if it was not.
     */
    public async getCurrentEmployeeRole(uid: string): Promise<number> {
        let employeeRole: number = 0;
        let employee = await getDoc(doc(this.#db, `employees`, uid)).catch(
            (error) => {
                this.getErrorMessageFromCode(error);
            }
        );
        if (employee && employee) {
            let employeeData = employee.data();
            if (employeeData) {
                employeeRole = employeeData.role;
                if (!employeeData.role) {
                    return 0;
                }
            }
        }
        return employeeRole;
    }

    /**
     * This method is used to get the job titles list. If the request was not successful, it will return an error message.
     * @method getJobTitles
     * @async
     * @public
     * @memberof APIManager
     * @returns {Promise<EmployeeJobTitleList | string>} The job titles if the request was successful, and the error message if it was not.
     */
    public async getJobTitles(): Promise<EmployeeJobTitleList | string> {
        let errorMessage: string | null = null;
        let jobTitles: string[] = [];
        let queryDepartment = query(collection(this.#db, `jobTitles`));
        let snaps = await getDocs(queryDepartment).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error);
        });
        if (snaps) {
            snaps.docs.forEach((doc: QueryDocumentSnapshot) => {
                jobTitles.push(doc.data().name);
            });
        }
        return errorMessage ?? jobTitles;
    }

    /**
     * This method is used to get the current employee's schedule. If the request was not successful, it will return an error message.
     * @method getCurrentEmployeeSchedule
     * @async
     * @public
     * @memberof APIManager
     * @returns {Promise<Shift[] | string>} The schedule of the employee if the request was successful, and the error message if it was not.
     */
    public async getCurrentEmployeeSchedule(): Promise<Shift[] | string> {
        let shifts: Shift[] | string = [];
        if (this.#user?.uid) {
            shifts = await this.getScheduleForOneEmployee(this.#user.uid);
        }

        return shifts;
    }

    /**
     * This method is used to get the schedule of one employee. If the request was not successful, it will return an error message.
     * @param idEmployee The ID of the employee.
     * @method getScheduleForOneEmployee
     * @async
     * @public
     * @memberof APIManager
     * @returns {Promise<Shift[] | string>} The schedule of the employee if the request was successful, and the error message if it was not.
     */
    public async getScheduleForOneEmployee(idEmployee?: string): Promise<Shift[] | string> {
        let errorMessage: string | null = null;
        let shifts: Shift[] = [];

        if (this.isAuthenticated) {
            let queryShifts = query(
                collection(this.#db, `shifts`),
                where("employeeId", "==", idEmployee)
            );

            let snaps = await getDocs(queryShifts).catch((error) => {
                errorMessage = this.getErrorMessageFromCode(error);
            });

            if (snaps) {
                snaps.docs.forEach((doc) => {
                    let data = doc.data();
                    shifts.push(
                        new Shift({
                            id: doc.id,
                            employeeId: data.employeeId,
                            department: data.department,
                            start: this.getDayPilotDateString(data.start),
                            end: this.getDayPilotDateString(data.end),
                        })
                    );
                });
            }
        }

        return errorMessage ?? shifts;
    }

    /**
     * Convert firebase timestamp to daypilot string
     * @param date the firebase timestamp to convert
     * @returns string daypilot Ex: (February 2, 2022 at 3:15 AM) = 2022-02-16T03:15:00
     */
    private getDayPilotDateString(date: Timestamp): string {
        //Take UTC timestamp, remove timezone offset, convert to ISO format
        let myDate = new Date((date.seconds - new Date().getTimezoneOffset() * 60) * 1000).toISOString();
        return myDate.slice(0, -5);
    }

    /**
     * Converti une date de daypilot en timestamp firebase
     * @param daypilotString string daypilot Ex: (2 février 2022 à 3h15 AM) = 2022-02-16T03:15:00
     * @returns Timestamp firebase
     */
    private getFirebaseTimestamp(daypilotString: string): Timestamp {
        return new Timestamp(Date.parse(daypilotString) / 1000, 0);
    }

    /**
     * Récupère l'horaire de la journée d'un département pour une journée
     * @param day
     * @param department le nom du département que récupérer
     * @returns une liste de quarts de travail d'un département pour une journée
     */

    /**
     * This method is used to get the schedule of a department for a day. If the request was not successful, it will return an error message.
     * @method getDailyScheduleForDepartment
     * @async
     * @public
     * @memberof APIManager
     * @param {DayPilot.Date} day The day to get the schedule for.
     * @param {Department} department The department to get the schedule for.
     * @returns {Promise<Shift[] | string>} The schedule of the department for the day if the request was successful, and the error message if it was not.
     */
    public async getDailyScheduleForDepartment(day: DayPilot.Date, department: Department): Promise<Shift[] | string> {
        let errorMessage: string | null = null;
        let shifts: Shift[] = [];

        //Validate permissions
        if (!this.isAuthenticated) return errors.PERMISSION_DENIED;
        if (!this.hasPermission(4)) {
            //TODO: pass if user is director
            return errors.PERMISSION_DENIED;
        }

        //Convert Daypilot datetimes to Timestamps
        let convertedStartDay: Timestamp = this.getFirebaseTimestamp(day);
        let convertedEndDay: Timestamp = this.getFirebaseTimestamp(day.addDays(1));

        //Query shifts
        let queryShifts = query(
            collection(this.#db, `shifts`),
            where("department", "==", department.name),
            where("end", ">", convertedStartDay),
            where("end", "<", convertedEndDay)
        );

        let snaps = await getDocs(queryShifts).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error);
        });

        //Parse recieved data
        if (snaps) {
            for (let doc of snaps.docs) {
                let shift = doc.data();

                //Push shift object
                shifts.push(new Shift({
                    id: doc.id,
                    employeeId: shift.employeeId,
                    department: shift.department,
                    start: this.getDayPilotDateString(shift.start),
                    end: this.getDayPilotDateString(shift.end),
                }));
            }
        }

        return errorMessage ?? shifts;
    }

    /**
     * This method is used to create a shift. If the request was not successful, it will return an error message.
     * @method createShift
     * @async
     * @public
     * @memberof APIManager
     * @param {Shift} shift The shift to create.
     * @returns {Promise<void | string>} Nothing if the request was successful, and the error message if it was not.
     */
    public async createShift(shift: ShiftCreateDTO): Promise<void | string> {
        //Check if user has permission
        if (!this.hasPermission(2)) {
            //Gestionnaire
            return errors.PERMISSION_DENIED;
        }

        let errorMessage: string | null = null;

        //Create Shift
        await addDoc(collection(this.#db, `shifts`),
            {
                department: shift.department,
                employeeId: shift.employeeId,
                end: this.getFirebaseTimestamp(shift.end),
                start: this.getFirebaseTimestamp(shift.start)
            },
        ).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error);
        });

        if (errorMessage) return errorMessage;
    }

    /**
     * This method is used to edit a shift. If the request was not successful, it will return an error message.
     * @method editShift
     * @async
     * @public
     * @memberof APIManager
     * @param {Shift} shift The shift to edit.
     * @returns {Promise<void | string>} Nothing if the request was successful, and the error message if it was not.
     */
    public async editShift(shift: Shift): Promise<void | string> {
        //Check if user has permission
        if (!this.hasPermission(2)) {
            //Gestionnaire
            return errors.PERMISSION_DENIED;
        }

        let errorMessage: string | null = null;

        //Edit Shift
        await setDoc(doc(this.#db, `shifts`, shift.id),
            {
                department: shift.department,
                employeeId: shift.employeeId,
                end: this.getFirebaseTimestamp(shift.end),
                start: this.getFirebaseTimestamp(shift.start)
            },
        ).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error);
        });

        if (errorMessage) return errorMessage;
    }
}

/**
 * Instantiate the APIManager class and export it as a singleton.
 */
export const API = new APIManager();

// @ts-ignore
window.API = API;
