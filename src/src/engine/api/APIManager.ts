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
    deleteDoc,
    doc,
    enableIndexedDbPersistence,
    Firestore,
    getDoc,
    getDocs,
    getFirestore,
    query,
    QuerySnapshot,
    setDoc,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore";

import {FirebasePerformance, getPerformance} from "firebase/performance";
import {FIREBASE_AUTH_EMULATOR_PORT, firebaseConfig, FIRESTORE_EMULATOR_PORT} from "./config/FirebaseConfig";
import {
    Employee, EmployeeCreateDTO,
    EmployeeEditDTO, EmployeeInfos,
    EmployeeJobTitleList,
    EmployeeRoleList,
    EmployeeSkillList
} from "../types/Employee";
import {Department, DepartmentModifyDTO} from "../types/Department";
import {Shift, ShiftCreateDTO} from "../types/Shift";
import {errors} from "../messages/APIMessages";
import {
    CreatedAccountData,
    Task,
    ThreadMessage,
    ThreadMessageType,
} from "./types/ThreadMessage";

import {Roles} from "../types/Roles";
import {DayPilot} from "@daypilot/daypilot-lite-react";

import {
    DAYS,
    EmployeeAvailabilities,
    EmployeeAvailabilitiesForCreate,
    RecursiveAvailabilitiesList
} from "../types/EmployeeAvailabilities";
import {JobTitle} from "../types/JobTitle";
import {APIUtils} from "./APIUtils";
import {Skill} from "../types/Skill";
import {NotificationManager} from "./NotificationManager";

type SubscriberCallback =
    () =>
        | void
        | (() => Promise<void>)
        | PromiseLike<void>;

const SECONDS_IN_DAY: number = 86400;

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

    //region Attributes
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
    #employeeInfos: EmployeeInfos = {
        role: 0,
        department: '',
        hasChangedDefaultPassword: false
    };

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

        // JEST doesn't support web workers.
        try {
            if (process === null || process === undefined) {
                this.registerServiceWorker();
            }
        } catch (e) {
            this.registerServiceWorker();
        }
    }

    //endregion

    //region GETTERS

    /**
     * Return if the user has changed the default password.
     * @readonly
     * @type {boolean}
     * @memberof APIManager
     * @returns {boolean} Whether the user has changed the default password.
     */
    get hasChangedDefaultPassword(): boolean {
        return this.#employeeInfos.hasChangedDefaultPassword;
    }

    /**
     * Returns the current user role.
     * @readonly
     * @type {number}
     * @memberof APIManager
     * @returns {number} The current user role.
     */
    public get userRole(): number {
        return this.#employeeInfos.role;
    }

    /**
     * This method returns the current employee name.
     * @readonly
     * @type {string}
     * @memberof APIManager
     * @returns {string} The current employee name.
     */
    public getEmployeeName(): string {
        return this.#user?.displayName || this.#user?.email || "Anonyme";
    }

    public getCurrentEmployeeInfos(): EmployeeInfos {
        return this.#employeeInfos;
    }

    /**
     * This method returns if the user is authenticated or not.
     * @returns {boolean} True if the user is authenticated, false otherwise.
     * @memberof APIManager
     * @method isAuth
     */
    public isAuth(): boolean {
        return this.isAuthenticated;
    }

    /**
     * This method returns true if the current user has the given permissions.
     * @param permissionLevel The permission level to check.
     * @returns {boolean} True if the user has the given permissions, false otherwise.
     */
    public hasPermission(permissionLevel: Roles): boolean {
        return this.#employeeInfos.role >= permissionLevel;
    }

    /**
     * This method returns true if the current user has a lower permission than the given one.
     * @param permissionLevel The permission level to check.
     * @returns {boolean} True if the user has a lower permission than the given one, false otherwise.
     */
    public hasLowerPermission(permissionLevel: Roles): boolean {
        return this.#employeeInfos.role > permissionLevel;
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
     * @param {Employee} employee The employee data of the new user.
     * @param {string} password The password of the new user.
     * @private
     * @async
     * @method requestUserCreationFromWorker
     * @returns {Promise<CreatedAccountData>}
     * @memberof APIManager
     */
    private requestUserCreationFromWorker(
        employee: Employee,
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
            errorMessage = APIUtils.getErrorMessageFromCode(error);
        });

        if (userCredentials !== null && userCredentials) {
            console.log("credentials", userCredentials);

            if (userCredentials.user !== null && userCredentials.user) {
                this.#user = userCredentials.user;
            }

            this.isAuthenticated = true;
        }

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
                errorMessage = APIUtils.getErrorMessageFromCode(error);
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

        if (this.isAuthenticated) {
            await FirebaseAuth.signOut(this.#auth).catch((error) => {
                errorMessage = APIUtils.getErrorMessageFromCode(error);
            });
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
            errorMessage = APIUtils.getErrorMessageFromCode(error);
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
                        this.#employeeInfos = {
                            role: 0,
                            department: '',
                            hasChangedDefaultPassword: false
                        };

                    } else {
                        this.isAuthenticated = true;
                        this.#user = user;
                        let result = await this.getEmployeeInfos(user.uid);
                        if (typeof result === "string") {
                            NotificationManager.error(errors.AUTHENTIFICATION_ERROR, result);
                            this.#employeeInfos = {
                                role: 0,
                                department: '',
                                hasChangedDefaultPassword: false
                            };
                        } else {
                            this.#employeeInfos = result as EmployeeInfos;
                        }

                        console.log("user", user);
                        console.log("employeeInfos", this.#employeeInfos);
                    }
                    await this.onEvent();

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
            errorMessage = APIUtils.getErrorMessageFromCode(error);
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
                errorMessage = APIUtils.getErrorMessageFromCode(error);
            }
        );
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
    public async changeEmployeeResetToggle(employeeId: string): Promise<string | null> {
        let errorMessage: string | null = null;

        if (employeeId) {
            await updateDoc(doc(this.#db, `employees`, employeeId), {
                hasChangedDefaultPassword: true
            }).catch((error) => {
                errorMessage = APIUtils.getErrorMessageFromCode(error);
            });
        } else {
            errorMessage = errors.INVALID_EMPLOYEE_ID;
        }
        return errorMessage;
    }

    /**
     * This method is used to change the password of the current user.
     * @param newPassword The new password.
     * @returns {Promise<string | null>} Null if the password was changed successfully, and the error message if it was not.
     * @memberof APIManager
     * @method changePassword
     * @async
     * @public
     */
    public async changePassword(
        newPassword: string
    ): Promise<string | null> {
        let errorMessage: string | null = null;
        const user = this.#auth.currentUser;
        if (user !== null && user) {
            if (this.elementExist(user.email)) {
                let email = user.email || "";

                if (!this.hasChangedDefaultPassword) {
                    let employeeId = this.#user?.uid;

                    if (employeeId && this.#employeeInfos.department) {
                        errorMessage = await this.changeEmployeeResetToggle(employeeId);

                        if (errorMessage) {
                            return errorMessage;
                        }
                    }
                }

                await FirebaseAuth.updatePassword(
                    user,
                    newPassword
                ).catch((error) => {
                    errorMessage = APIUtils.getErrorMessageFromCode(error);
                });

                const credential = FirebaseAuth.EmailAuthProvider.credential(
                    email,
                    newPassword
                );

                if (!errorMessage) {
                    // Prompt the user to re-provide their sign-in credentials
                    let reAuth = await FirebaseAuth.reauthenticateWithCredential(
                        user,
                        credential
                    ).catch((error) => {
                        errorMessage = APIUtils.getErrorMessageFromCode(error);
                    });

                    if (reAuth?.user) {
                        this.#user = reAuth?.user || null;
                        this.isAuthenticated = false;
                    }
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
            errorMessage = APIUtils.getErrorMessageFromCode(
                createdUserMessageData.error
            );
        } else {
            let userAuth = createdUserMessageData.createdUser;
            let userId = userAuth?.userId;

            if (userId !== null && userId !== undefined && userId) {
                await setDoc(doc(this.#db, `employees`, userId), {
                    ...employee,
                }).catch((error) => {
                    errorMessage = APIUtils.getErrorMessageFromCode(error);
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
        let errorMessage: string | null = null;
        if (!this.hasPermission(Roles.ADMIN)) {
            return errors.PERMISSION_DENIED;
        }

        if (employeeId) {
            await updateDoc(doc(this.#db, `employees`, employeeId), {...employee}).catch((error) => {
                errorMessage = APIUtils.getErrorMessageFromCode(error);
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

        if (employee.id) {
            if (!this.hasPermission) {
                return errors.PERMISSION_DENIED;
            }
            await updateDoc(doc(this.#db, `employees`, employee.id), {isActive: employee.isActive}).catch((error) => {
                errorMessage = APIUtils.getErrorMessageFromCode(error);
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
        let errorMessage = await APIUtils.checkIfAlreadyExists(
            queryDepartment,
            errors.DEPARTMENT_ALREADY_EXISTS
        );
        if (!errorMessage) {
            await addDoc(collection(this.#db, `departments`), {
                ...department,
            }).catch((error) => {
                errorMessage = APIUtils.getErrorMessageFromCode(error);
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
        let errorMessage = await APIUtils.checkIfAlreadyExists(
            queryDepartment,
            errors.DEPARTMENT_ALREADY_EXISTS
        );
        if (!errorMessage) {
            await updateDoc(doc(this.#db, `departments`, departmentId), {...department}).catch((error) => {
                return APIUtils.getErrorMessageFromCode(error);
            });
            let queryEmployeesInDepartment = await query(collection(this.#db, `employees`),
                where("department", "==", department.name));
            let snaps = await getDocs(queryEmployeesInDepartment).catch((error) => {
                errorMessage = APIUtils.getErrorMessageFromCode(error);
            });
            if (snaps) {
                for (const snap of snaps.docs) {
                    await updateDoc(doc(this.#db, `employees`, snap.id), {department: department.name});
                }
            }
        }
        return errorMessage;
    }

    /**
     * This method is used to delete a jobTitle from the database
     * @param department the department
     */
    public async deleteDepartment(department: Department): Promise<string | null> {
        let errorMessage: string | null = null;
        if (!this.hasPermission(Roles.ADMIN)) {
            return errors.PERMISSION_DENIED;
        }
        if (department.id) {
            let queryEmployeesInDepartment = await query(collection(this.#db, `employees`),
                where("department", "==", department.name));
            let snaps = await getDocs(queryEmployeesInDepartment).catch((error) => {
                errorMessage = APIUtils.getErrorMessageFromCode(error);
            });
            if (snaps && snaps.docs.length > 0) {
                return errors.EMPLOYEE_REMAINING_IN_DEPARTMENT;
            }
            await deleteDoc(doc(this.#db, `departments`, department.id)).catch((error) => {
                errorMessage = APIUtils.getErrorMessageFromCode(error);
            });
        } else {
            errorMessage = errors.INVALID_DEPARTMENT_ID;
        }


        return errorMessage;
    }

    /**
     * This method is used to add a jobTitle to the database
     * @param titleName the new jobTitle name
     */
    public async createJobTitle(
        titleName: string
    ): Promise<string | null> {
        if (!this.hasPermission) {
            return errors.PERMISSION_DENIED;
        }
        let queryJobTitles = query(
            collection(this.#db, `jobTitles`),
            where("name", "==", titleName)
        );
        let errorMessage = await APIUtils.checkIfAlreadyExists(
            queryJobTitles,
            errors.JOB_TITLE_ALREADY_EXISTS
        );
        if (!errorMessage) {
            await addDoc(collection(this.#db, `jobTitles`), {
                name: titleName,
            }).catch((error) => {
                errorMessage = APIUtils.getErrorMessageFromCode(error);
            });
        }
        return errorMessage;
    }

    /**
     * This method is used to edit a jobTitle from the database
     * @param jobTitle the jobTitle
     */
    public async editJobTitle(jobTitle: JobTitle): Promise<string | null> {
        if (!this.hasPermission(Roles.ADMIN)) {
            return errors.PERMISSION_DENIED;
        }
        let queryJobTitles = query(
            collection(this.#db, `jobTitles`),
            where("name", "==", jobTitle.name)
        );
        let errorMessage = await APIUtils.checkIfAlreadyExists(
            queryJobTitles,
            errors.JOB_TITLE_ALREADY_EXISTS
        );
        if (jobTitle.id) {
            await updateDoc(doc(this.#db, `jobTitles`, jobTitle.id), {name: jobTitle.name}).catch((error) => {
                errorMessage = APIUtils.getErrorMessageFromCode(error);
            });
        } else {
            errorMessage = errors.INVALID_JOB_TITLE_ID;
        }

        return errorMessage;
    }

    /**
     * This method is used to delete a jobTitle from the database
     * @param titleId the jobTitle identifier generated by the Firestore API
     */
    public async deleteJobTitle(titleId: string): Promise<string | null> {
        let errorMessage: string | null = null;
        if (!this.hasPermission(Roles.ADMIN)) {
            return errors.PERMISSION_DENIED;
        }
        await deleteDoc(doc(this.#db, `jobTitles`, titleId)).catch((error) => {
            errorMessage = APIUtils.getErrorMessageFromCode(error);
        });

        return errorMessage;
    }

    /**
     * This method is used to add a skill to the database
     * @param skill the skill
     */
    public async createSkill(skill: string): Promise<string | null> {
        if (!this.hasPermission) {
            return errors.PERMISSION_DENIED;
        }
        let querySkills = query(
            collection(this.#db, `skills`),
            where("name", "==", skill)
        );
        let errorMessage = await APIUtils.checkIfAlreadyExists(querySkills, errors.SKILL_ALREADY_EXISTS);
        if (!errorMessage) {
            await addDoc(collection(this.#db, `skills`), {
                name: skill,
            }).catch((error) => {
                errorMessage = APIUtils.getErrorMessageFromCode(error);
            });
        }
        return errorMessage;
    }

    /**
     * This method is used to edit a skill from the database
     * @param skill the skill
     */
    public async editSkill(skill: Skill): Promise<string | null> {
        if (!this.hasPermission(Roles.ADMIN)) {
            return errors.PERMISSION_DENIED;
        }
        let querySkills = query(
            collection(this.#db, `skills`),
            where("name", "==", skill)
        );
        let errorMessage = await APIUtils.checkIfAlreadyExists(querySkills, errors.DEPARTMENT_ALREADY_EXISTS);
        if (!errorMessage) {
            if (skill.id) {
                await updateDoc(doc(this.#db, `skills`, skill.id), {name: skill.name}).catch((error) => {
                    errorMessage = APIUtils.getErrorMessageFromCode(error);
                });
            } else {
                errorMessage = errors.INVALID_SKILL_ID;
            }
        }

        return errorMessage;
    }

    /**
     * This method is used to delete a skill from the database
     * @param skillId the skill identifier generated by Firestore API
     */
    public async deleteSkill(skillId: string): Promise<string | null> {
        let errorMessage: string | null = null;
        if (!this.hasPermission(Roles.ADMIN)) {
            return errors.PERMISSION_DENIED;
        }
        if (skillId) {
            await deleteDoc(doc(this.#db, `skills`, skillId)).catch((error) => {
                errorMessage = APIUtils.getErrorMessageFromCode(error);
            });
        } else {
            errorMessage = errors.INVALID_SKILL_ID;
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
            errorMessage = APIUtils.getErrorMessageFromCode(error);
        });

        if (snaps) {
            for (const doc of snaps.docs) {
                let data = doc.data();
                employees.push(
                    {
                        id: doc.id,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        isActive: data.isActive,
                        phoneNumber: data.phoneNumber,
                        department: data.department,
                        jobTitles: data.jobTitles,
                        skills: data.skills,
                        role: data.role,
                        hasChangedDefaultPassword: data.hasChangedDefaultPassword || false
                    }
                );
            }
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
            errorMessage = APIUtils.getErrorMessageFromCode(error);
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
            errorMessage = APIUtils.getErrorMessageFromCode(error);
        });

        if (snaps) {
            for (let doc of snaps.docs) {
                departments.push(
                    new Department({
                        id: doc.id,
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

            let promises: Promise<void | QuerySnapshot>[] = [];

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
                errorMessage = APIUtils.getErrorMessageFromCode(error);
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
            errorMessage = APIUtils.getErrorMessageFromCode(error);
        });

        if (snaps) {
            for (const doc of snaps.docs) {
                roles.push(doc.data().name);
            }
        }

        return errorMessage ?? roles;
    }

    /**
     * This method is used to get employee information. If the request was not successful, it will return an error message.
     * @param uid The ID of the employee.
     * @method getEmployeeInfos
     * @async
     * @public
     * @memberof APIManager
     * @returns {Promise<number | string>} The role of the employee if the request was successful, and the error message if it was not.
     */
    public async getEmployeeInfos(uid: string): Promise<EmployeeInfos | string> {
        let errorMessage: string | null = null;
        let employeeInfos: EmployeeInfos = {
            role: 0,
            department: "",
            hasChangedDefaultPassword: false
        };

        let employee = await getDoc(doc(this.#db, `employees`, uid)).catch((error) => {
            errorMessage = APIUtils.getErrorMessageFromCode(error);
        });

        if (employee) {
            employeeInfos = employee.data() as EmployeeInfos;
        }

        return errorMessage ?? employeeInfos;
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
        let jobTitles: JobTitle[] = [];
        let queryJobTitles = query(collection(this.#db, `jobTitles`));
        let snaps = await getDocs(queryJobTitles).catch((error) => {
            errorMessage = APIUtils.getErrorMessageFromCode(error);
        });
        if (snaps) {
            for (const doc of snaps.docs) {
                jobTitles.push(new JobTitle({id: doc.id, name: doc.data().name}));
            }
        }
        return errorMessage ?? jobTitles;
    }

    public async getSkills(): Promise<EmployeeSkillList | string> {
        let errorMessage: string | null = null;
        let skills: Skill[] = [];
        let querySkills = query(collection(this.#db, `skills`));
        let snaps = await getDocs(querySkills).catch((error) => {
            errorMessage = APIUtils.getErrorMessageFromCode(error);
        });
        if (snaps) {
            for (const doc of snaps.docs) {
                skills.push(new Skill({id: doc.id, name: doc.data().name}));
            }
        }
        return errorMessage ?? skills;
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
        if (!idEmployee) {
            return errors.INVALID_EMPLOYEE_ID;
        }
        let document = await getDoc(doc(this.#db, `employees`, idEmployee)).catch((error) => {
            return APIUtils.getErrorMessageFromCode(error);
        });

        if (typeof document !== "string" && !document.exists()) {
            return errors.INVALID_EMPLOYEE_ID;
        }
        if (!errorMessage) {
            let queryShifts = query(
                collection(this.#db, `shifts`),
                where("employeeId", "==", idEmployee)
            );

            let snaps = await getDocs(queryShifts).catch((error) => {
                errorMessage = APIUtils.getErrorMessageFromCode(error);
            });

            if (snaps) {
                for (const doc of snaps.docs) {
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
                }
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
        if (!this.hasPermission(Roles.ADMIN) && !this.isManagerPermitted(department.name)) {
            return errors.PERMISSION_DENIED;
        }

        //Convert Daypilot datetimes to Timestamps
        let convertedStartDay: Timestamp = this.getFirebaseTimestamp(day);
        let convertedEndDay: Timestamp = new Timestamp(convertedStartDay.seconds + SECONDS_IN_DAY, 0);

        //Query shifts
        let queryShifts = query(
            collection(this.#db, `shifts`),
            where("department", "==", department.name),
            where("start", ">=", convertedStartDay),
            where("start", "<", convertedEndDay)
        );
        
        let snaps = await getDocs(queryShifts).catch((error) => {
            errorMessage = APIUtils.getErrorMessageFromCode(error);
        });

        //Parse recieved data
        if (snaps) {
            for (let doc of snaps.docs) {
                let shift = doc.data();
                //Validated end moment
                if (shift.end <= convertedEndDay) {
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
        if (!this.hasPermission(Roles.ADMIN) && !this.isManagerPermitted(shift.department)) {
            //Manager or less
            return errors.PERMISSION_DENIED;
        }

        let errorMessage: string | undefined;

        //Create Shift
        await addDoc(collection(this.#db, `shifts`),
            {
                department: shift.department,
                employeeId: shift.employeeId,
                end: this.getFirebaseTimestamp(shift.end),
                start: this.getFirebaseTimestamp(shift.start)
            },
        ).catch((error) => {
            errorMessage = APIUtils.getErrorMessageFromCode(error);
        });

        return errorMessage;
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
        if (!this.hasPermission(Roles.ADMIN) && !this.isManagerPermitted(shift.department)) {
            //Manager or less
            return errors.PERMISSION_DENIED;
        }

        let errorMessage: string | undefined;

        //Edit Shift
        await setDoc(doc(this.#db, `shifts`, shift.id),
            {
                department: shift.department,
                employeeId: shift.employeeId,
                end: this.getFirebaseTimestamp(shift.end),
                start: this.getFirebaseTimestamp(shift.start)
            },
        ).catch((error) => {
            errorMessage = APIUtils.getErrorMessageFromCode(error);
        });

        return errorMessage;
    }

    /**
     * This method is used to delete a shift. If the request was not successful, it will return an error message.
     * @method deleteShift
     * @async
     * @public
     * @memberof APIManager
     * @returns {Promise<void | string>} Nothing if the request was successful, and the error message if it was not.
     * @param shift
     */
    public async deleteShift(shift: Shift): Promise<void | string> {
        if (!this.hasPermission(Roles.ADMIN) && !this.isManagerPermitted(shift.department)) {
            return errors.PERMISSION_DENIED;
        }
        //Check if user has permission
        if (!this.hasPermission(Roles.ADMIN)) {
            //Manager or less
            return errors.PERMISSION_DENIED;
        }

        let errorMessage: string | undefined;

        //Delete Shift
        await deleteDoc(doc(this.#db, `shifts`, shift.id)
        ).catch((error) => {
            errorMessage = APIUtils.getErrorMessageFromCode(error);
        });

        return errorMessage;
    }

    public isManagerPermitted(department: string) {
        return this.hasPermission(Roles.MANAGER) && department === this.#employeeInfos?.department;
    }

    /**
     * Check if the unavailability already exist with the same dates in the DB and if it is yes, it update with the new data and return true
     * @method checkUnavailabilityShouldUpdate
     * @async
     * @public
     * @memberof APIManager
     * @returns {Promise<string | boolean>} boolean if the request was successful or it doesn't need to update,
     * and the error message if it has an error in Firebase.
     * @param list
     */
    private async unavailabilityUpdate(list: EmployeeAvailabilitiesForCreate): Promise<string | boolean> {
        let errorMessage: string | undefined;
        let isAdded = false;
        let queryUnavailability = query(
            collection(this.#db, `unavailabilities`),
            where("employeeId", "==", this.#user?.uid)
        );

        let snaps = await getDocs(queryUnavailability).catch((error) => {
            errorMessage = APIUtils.getErrorMessageFromCode(error);
        });

        if (snaps) {
            //check if a document with the same dates and that is not accepted already exists
            for (let document of snaps.docs) {
                let data = document.data();
                if (!data.isAccepted) {
                    if (data.unavailabilities.startDate === list.recursiveExceptions.startDate
                        && data.unavailabilities.endDate === list.recursiveExceptions.endDate) {
                        await updateDoc(doc(this.#db, `unavailabilities`, document.id),
                            {unavailabilities: list.recursiveExceptions}).catch((error) => {
                            errorMessage = APIUtils.getErrorMessageFromCode(error);

                        });
                        isAdded = true;
                        break;
                    }
                }
            }
        }
        return errorMessage ?? isAdded;
    }

    /**
     * Create a pending unavailability list for the manager
     * @param list
     * @returns {void}
     */
    public async pushAvailabilitiesToManager(list: EmployeeAvailabilitiesForCreate): Promise<void | string> {
        if (!this.hasPermission(Roles.EMPLOYEE)) {
            //Is not an Employee
            return errors.PERMISSION_DENIED;
        }

        let errorMessage: string | undefined;

        //Create unavailability
        let isUpdated = await this.unavailabilityUpdate(list)
        if (!isUpdated && typeof isUpdated === "boolean") {
            await addDoc(collection(this.#db, `unavailabilities`),
                {
                    employeeId: this.#user?.uid,
                    unavailabilities: list.recursiveExceptions,
                    isAccepted: false,
                },
            ).catch((error) => {
                errorMessage = APIUtils.getErrorMessageFromCode(error);
            });
            //return the error
        } else if (typeof isUpdated === "string") {
            errorMessage = isUpdated;
            return errorMessage;
        }


    }

    /**
     * get the current employee unavailabilities
     * @method getCurrentEmployeeunavailabilities
     * @async
     * @public
     * @memberof APIManager
     * @returns {Promise<string | boolean>} Nothing if the request was successful, and the error message if it was not.
     * @param list
     */
    public async getCurrentEmployeeUnavailabilities(): Promise<EmployeeAvailabilities | string> {
        let returnList: string | EmployeeAvailabilities;

        if (this.#user?.uid) {
            returnList = await this.getOneEmployeeUnavailabilities(this.#user?.uid);
        } else {
            returnList = errors.PERMISSION_DENIED;
        }
        return returnList;
    }

    /**
     *
     * @param idEmployee to get the unavailabilities
     * @returns the list of unavailabilities
     */
    public async getOneEmployeeUnavailabilities(idEmployee: string): Promise<EmployeeAvailabilities | string> {
        let errorMessage: string | null = null;
        //default value
        let list: EmployeeAvailabilities = {
            recursiveExceptions: [],
            employeeId: idEmployee ?? ""
        };
        //list that will return
        let listOfRecursive: RecursiveAvailabilitiesList = [];
        if (this.isAuthenticated) {
            let queryUnavailability = query(
                collection(this.#db, `unavailabilities`),
                where("employeeId", "==", list.employeeId)
            );

            let snaps = await getDocs(queryUnavailability).catch((error) => {
                errorMessage = APIUtils.getErrorMessageFromCode(error);
            });

            if (snaps) {
                //push all the recursiveExceptions  in the list
                for (let document of snaps.docs) {
                    let data = document.data();
                    //need to be accepted to be showed
                    if (data.isAccepted) {
                        listOfRecursive.push(
                            {
                                startDate: new Date((data.start.seconds) * 1000),
                                endDate: new Date((data.end.seconds) * 1000),
                                [DAYS.SUNDAY]: data.unavailabilities[DAYS.SUNDAY],
                                [DAYS.MONDAY]: data.unavailabilities[DAYS.MONDAY],
                                [DAYS.TUESDAY]: data.unavailabilities[DAYS.TUESDAY],
                                [DAYS.WEDNESDAY]: data.unavailabilities[DAYS.WEDNESDAY],
                                [DAYS.THURSDAY]: data.unavailabilities[DAYS.THURSDAY],
                                [DAYS.FRIDAY]: data.unavailabilities[DAYS.FRIDAY],
                                [DAYS.SATURDAY]: data.unavailabilities[DAYS.SATURDAY]
                            }
                        );
                    }

                }
                list.recursiveExceptions = listOfRecursive;
            }
        }

        return errorMessage ?? list;
    }

    /**
     * This function fetches all pending unavailabilities for one department
     * @param departmentName the name of the department to fetch
     * @returns a string if its an error, a list of Unavailabilities if its not
     */
    public async getPendingUnavailabilitiesForDepartment(departmentName: string): Promise<string | any[]> {
        let errorMessage: string | null = null;
        let unavailabilities: any[] = [];
        //Validate permissions
        let isManagerPermitted = this.hasPermission(Roles.MANAGER) && departmentName === this.#employeeInfos.department;
        if (!this.hasPermission(Roles.ADMIN) && !isManagerPermitted) {
            return errors.PERMISSION_DENIED;
        }

        //Query unavailabilities
        let queryShifts = query(
            collection(this.#db, `unavailabilities`),
            where("department", "==", departmentName),
            where("isAccepted", "==", false)
        );

        let snaps = await getDocs(queryShifts).catch((error) => {
            errorMessage = APIUtils.getErrorMessageFromCode(error);
        });

        //Parse recieved data
        if (snaps) {
            for (let doc of snaps.docs) {
                let unavailability = doc.data();
                //Push unavailability object


            }
        }
        return errorMessage ?? unavailabilities;
    }

    public async getAllPendingUnavailabilities(): Promise<string | any[]> {
        let errorMessage: string | null = null;
        let unavailabilities: any[] = [];
        //Validate permissions
        if (!this.hasPermission(Roles.ADMIN)) {
            return errors.PERMISSION_DENIED;
        }

        //Query unavailabilities
        let queryShifts = query(
            collection(this.#db, `unavailabilities`),
            where("isAccepted", "==", false)
        );

        let snaps = await getDocs(queryShifts).catch((error) => {
            errorMessage = APIUtils.getErrorMessageFromCode(error);
        });

        //Parse recieved data
        if (snaps) {
            for (let doc of snaps.docs) {
                let unavailability = doc.data();
                //Push unavailability object


            }
        }
        return errorMessage ?? unavailabilities;
    }
}

/**
 * Instantiate the APIManager class and export it as a singleton.
 */
export const API = new APIManager();

// @ts-ignore
window.API = API;
