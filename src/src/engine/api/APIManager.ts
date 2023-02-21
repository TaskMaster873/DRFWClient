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
import {Employee, EmployeeCreateDTO, EmployeeEditDTO} from "../types/Employee";
import {Department, DepartmentCreateDTO} from "../types/Department";
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

type SubscriberCallback = () =>
    | void
    | (() => Promise<void>)
    | PromiseLike<void>;

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
    #user: FirebaseAuth.User | null = null;
    #userRole: number = 0;

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

    public get userRole() {
        return this.#userRole;
    }

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

    private generateTaskId(): string {
        return Math.random().toString(36).substring(2);
    }

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

    private listenWorkerEvents(): void {
        if (this.#worker !== null && this.#worker) {
            this.#worker.onmessage = this.onWorkerMessage.bind(this);
        }
    }

    /**
     * Fonction retourne le nom de l'employé
     * @returns Le nom de l'employé si non défini retourne l'adresse courriel sinon Anonyme
     */
    public getEmployeeName(): string {
        return this.#user?.displayName || this.#user?.email || "Anonyme";
    }

    private async onEvent(): Promise<void> {
        for (let subscriber of this.subscribers) {
            await subscriber();
        }
    }

    public subscribeToEvent(subscriber: SubscriberCallback): void {
        this.subscribers.push(subscriber);
    }

    public isAuth(): boolean {
        return this.isAuthenticated;
    }

    public hasPermission(permissionLevel: number): boolean {
        return this.#userRole >= permissionLevel;
    }

    public getErrorMessageFromCode(error: Error | string): string {
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

    public async sendResetPassword(email: string): Promise<string | null> {
        let errorMessage: string | null = null;
        await FirebaseAuth.sendPasswordResetEmail(this.#auth, email).catch(
            (error) => {
                errorMessage = this.getErrorMessageFromCode(error);
            }
        );

        return errorMessage;
    }

    public async logout(): Promise<string | null> {
        this.log("Logging out...");
        let errorMessage: string | null = null;
        await FirebaseAuth.signOut(this.#auth).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error);
        });
        this.#userRole = -1;

        await this.onEvent();
        return errorMessage;
    }

    private async verifyEmailAddress(
        user: FirebaseAuth.User
    ): Promise<string | null> {
        let errorMessage: string | null = null;
        await FirebaseAuth.sendEmailVerification(user).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error);
        });
        return errorMessage;
    }

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

    private async loadFirebase(): Promise<void> {
        this.#app = initializeApp(firebaseConfig);

        this.#auth = FirebaseAuth.getAuth(this.#app);
        let loginAwait = this.listenEvents();

        this.#performance = getPerformance(this.#app);
        this.#db = getFirestore(this.#app);

        //Should this database be emulated?
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

    private elementExist(element: any): boolean {
        return element !== undefined && element !== null;
    }

    /**
     * Valide le code de réinitialisation de mot de passe
     * @param actionCode Le code de réinitialisation de mot de passe
     * @returns Soit le courriel ou rien
     */
    public async verifyResetPassword(
        actionCode: string
    ): Promise<string | void> {
        return await verifyPasswordResetCode(this.#auth, actionCode).catch(
            (error) => {
                this.getErrorMessageFromCode(error);
            }
        );
    }

    /**
     * Valide le code de réinitialisation de mot de passe et applique le nouveau mot de passe
     * @param actionCode Le code de réinitialisation de mot de passe
     * @param newPassword Le nouveau mot de passe
     * @returns null si la réinitialisation a réussie, et le message d'erreur si elle n'a pas réussie
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

                let isOk = await FirebaseAuth.updatePassword(
                    user,
                    newPassword
                ).catch((error) => {
                    errorMessage = this.getErrorMessageFromCode(error);
                });

                console.log("change password", isOk);

                // Prompt the user to re-provide their sign-in credentials
                let reAuth = await FirebaseAuth.reauthenticateWithCredential(
                    user,
                    credential
                ).catch((error) => {
                    errorMessage = this.getErrorMessageFromCode(error);
                });
                console.log("reauth", reAuth);
            }
        }
        return errorMessage;
    }

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

    public async createDepartment(
        department: DepartmentCreateDTO
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

    public async editDepartment(department: Department): Promise<string | null> {
        if (!this.hasPermission(Roles.ADMIN)) {
            return errors.PERMISSION_DENIED;
        }
        let errorMessage: string | null = null;
        if (department.departmentId) {
            await updateDoc(doc(this.#db, `departments`, department.departmentId), {...department}).catch((error) => {
                errorMessage = this.getErrorMessageFromCode(error);
            });
        } else {
            errorMessage = errors.INVALID_EMPLOYEE_ID;
        }
        return errorMessage;
    }

    private async checkIfAlreadyExists(query, error: string) {
        let errorMessage: string | null = null;
        let snaps = await getDocs(query).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error);
        });
        if (snaps && snaps.docs.length > 0) {
            errorMessage = error;
        }
        return errorMessage;
    }

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

    public async getDepartments(): Promise<Department[]> {
        let errorMessage: string | null = null;
        let departments: Department[] = [];
        let queryDepartment = query(collection(this.#db, `departments`));
        let snaps = await getDocs(queryDepartment).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error);
        });
        if (snaps) {
            snaps.docs.forEach((doc: QueryDocumentSnapshot) => {
                departments.push(
                    new Department({
                        name: doc.data().name,
                        director: doc.data().director,
                    })
                );
            });
        }
        return departments;
    }

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

            Promise.all(promises)
                .then((values) => {
                    for (let snapId in values) {
                        let snaps = values[snapId];
                        if (snaps !== null && snaps) {
                            employeeNb.push(snaps.docs.length);
                        }
                    }
                })
                .catch((error) => {
                    errorMessage = this.getErrorMessageFromCode(error);
                })
                .finally(() => {
                    resolve(errorMessage ?? employeeNb);
                });
        });
    }

    public async getRoles(): Promise<string[] | string> {
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

    public async getJobTitles(): Promise<string[] | string> {
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
     * Convert firebase timestamp to daypilot string
     * @param date the firebase timestamp to convert
     * @returns string daypilot Ex: (February 2, 2022 at 3:15 AM) = 2022-02-16T03:15:00
     */
    private getDayPilotDateString(date: Timestamp): string {
        return new Date(date.seconds * 1000).toISOString().slice(0, -5);
    }

    public async getCurrentEmployeeSchedule(): Promise<Shift[] | string> {
        return await this.getScheduleForOneEmployee(this.#user?.uid);
    }

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
                                employeeId: data.employeeId,
                                department: data.department,
                                projectName: data.projectName,
                                start: this.getDayPilotDateString(data.start),
                                end: this.getDayPilotDateString(data.end),
                            })
                        );
                    });
                }
                return errorMessage ?? shifts;
        } else {
            return errorMessage ?? shifts;
        }
    }

    /**
     * Converti une date de daypilot en timestamp firebase
     * @param daypilotString string daypilot Ex: (2 février 2022 à 3h15 AM) = 2022-02-16T03:15:00
     * @returns Timestamp firebase
     */
    private getFirebaseTimestamp(daypilotString: string): Timestamp {
        return new Timestamp(new Date(daypilotString).getTime() / 1000, 0);
    }

    /**
     * Récupère l'horaire de la journée d'un département pour une journée
     * @param startDay le début de la journée en string daypilot Ex: (2 février 2022 début de journée) = 2022-02-16T00:00:00
     * @param endDay la fin de la journée en string daypilot Ex: (2 février 2022 fin de journée) = 2022-02-16T24:00:00
     * @param department le nom du département que récupérer
     * @returns une liste de quarts de travail d'un département pour une journée
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
        //Get employees by department
        let fetchedData = await this.getEmployees(department.name);
        if (typeof fetchedData === "string") return fetchedData;
        let employees = fetchedData as Employee[];
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
                //Get employee name if present
                let fetchedEmployeeName = "Unknown";
                for (let employee of employees)
                    if (employee.employeeId == shift.employeeId)
                        fetchedEmployeeName = employee.firstName + " " + employee.lastName;
                //Push shift object
                shifts.push(new Shift({
                    employeeName: fetchedEmployeeName,
                    employeeId: shift.employeeId,
                    department: shift.department,
                    projectName: shift.projectName,
                    start: this.getDayPilotDateString(shift.start),
                    end: this.getDayPilotDateString(shift.end),
                }));
            }
        }
        return errorMessage ?? shifts;
    }

    /**
     *
     * @param shift est un shift avec toutes les données pour le créer
     * @returns un booléen pour savoir si il est créé
     */
    public async createShift(shift: Shift): Promise<boolean> {
        let isCreated: boolean = false;
        //Check if user has permission
        if (!this.hasPermission(2)) {
            //Gestionnaire
            return false;
        }
        //Get Employee Name and department
        console.log("CreateShift", shift);
        let queryEmployee = doc(this.#db, `employees`, shift.employeeId);

        let snaps = await getDoc(queryEmployee).catch((error) => {
            this.getErrorMessageFromCode(error);
        });
        if (snaps) {
            let data = snaps.data();
            if (data) {
                shift.employeeName = data.employeeName;
                shift.department = data.department;
            }
        }
        shift.projectName = "testing";
        //Create Shift
        let success = await addDoc(collection(this.#db, `shifts`), {
            ...shift,
        }).catch((error) => {
            this.getErrorMessageFromCode(error);
        });
        if (success) isCreated = true;
        return isCreated;
    }


}

export const API = new APIManager();

// @ts-ignore
window.API = API;
