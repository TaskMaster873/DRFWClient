import {Logger} from "../Logger";

import {FirebaseApp, initializeApp} from "firebase/app";
import {Analytics, getAnalytics, isSupported} from "firebase/analytics";

import * as FirebaseAuth from "firebase/auth";
import {confirmPasswordReset, connectAuthEmulator, verifyPasswordResetCode} from "firebase/auth";
import {addDoc, collection, connectFirestoreEmulator, doc, Firestore, getDoc, getDocs, getFirestore, query, QueryDocumentSnapshot, setDoc, where} from "firebase/firestore";
import {FirebasePerformance, getPerformance} from "firebase/performance";
import {firebaseConfig, FIREBASE_AUTH_EMULATOR_PORT, FIRESTORE_EMULATOR_PORT} from "./config/FirebaseConfig";
import {Employee, EmployeeCreateDTO} from "../types/Employee";
import {Department} from "../types/Department";
import {errors} from "../messages/APIMessages";

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

    public get isAdmin(): boolean {
        return this.#userRole >= 4;
    }

    public getErrorMessageFromCode(code): string {
        let errorMessage: string;
        switch (code) {
            case "auth/invalid-email":
                errorMessage = errors.invalidLogin;
                break;
            case "auth/user-not-found":
                errorMessage = errors.invalidLogin;
                break;
            case "auth/wrong-password":
                errorMessage = errors.invalidLogin;
                break;
            default:
                errorMessage = errors.defaultMessage;
                break;
        }
        this.error(`Erreur: ${errorMessage}`);
        return errorMessage;
    }

    public async loginWithPassword(email: string, password: string): Promise<string | null> {
        await API.awaitLogin;
        let errorMessage: string | null = null;
        let userCredentials = await FirebaseAuth.signInWithEmailAndPassword(this.#auth, email, password).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error.code);
        });

        if (userCredentials !== null && userCredentials) {
            console.log('credentials', userCredentials);

            if (userCredentials.user !== null && userCredentials.user) {
                this.#user = userCredentials.user;
            }

            this.isAuthenticated = true;
        }

        this.onEvent();
        return errorMessage;
    }

    public async sendResetPassword(email: string): Promise<string | null> {
        let errorMessage: string | null = null;
        await FirebaseAuth.sendPasswordResetEmail(this.#auth, email).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error.code);
        });

        return errorMessage;
    }

    public async logout(): Promise<string | null> {
        this.log('Logging out...');
        let errorMessage: string | null = null;
        await FirebaseAuth.signOut(this.#auth).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error.code);
        });

        this.onEvent();
        return errorMessage;
    }

    private async verifyEmailAddress(user: FirebaseAuth.User): Promise<string | null> {
        let errorMessage: string | null = null;
        await FirebaseAuth.sendEmailVerification(user).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error.code);
        });
        return errorMessage;
    }

    private async listenEvents(): Promise<void> {
        let resolved = false;

        this.awaitLogin = new Promise(async (resolve) => {
            FirebaseAuth.onAuthStateChanged(this.#auth, async (user: FirebaseAuth.User | null) => {
                this.log('Auth state changed!');

                if (user === null || !user) {
                    this.isAuthenticated = false;
                } else {
                    this.isAuthenticated = true;
                    this.#user = user;
                    this.#userRole = await this.getCurrentEmployeeRole(user.uid);

                    console.log('user', user);
                    console.log('userRole', this.#userRole);
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

        this.#auth = FirebaseAuth.getAuth(this.#app);
        this.#performance = getPerformance(this.#app);
        this.#db = getFirestore(this.#app);

        await this.listenEvents();

        let isAnalyticsSupported = await isSupported();
        if (isAnalyticsSupported) {
            this.#analytics = getAnalytics(this.#app);
        }

        //Should this database be emulated?
        if (location.hostname === "localhost") {
            connectAuthEmulator(this.#auth, "http://localhost:" + FIREBASE_AUTH_EMULATOR_PORT);
            connectFirestoreEmulator(this.#db, "localhost", FIRESTORE_EMULATOR_PORT);
        }

        this.log("Firebase loaded");
    }

    private elementExist(element: any): boolean {
        return element !== undefined && element !== null;
    }

    /**
     * Valide le code de réinitialisation de mot de passe
     * @param actionCode Le code de réinitialisation de mot de passe
     * @returns Soi le courriel ou rien
     */
    public async verifyResetPassword(actionCode: string): Promise<string | void> {
        let accountEmail: string | void;
        accountEmail = await verifyPasswordResetCode(this.#auth, actionCode).catch((error) => {
            this.getErrorMessageFromCode(error.code);
        })
        return accountEmail;
    }

    /**
     * Valide le code de réinitialisation de mot de passe et applique le nouveau mot de passe
     * @param actionCode Le code de réinitialisation de mot de passe
     * @param newPassword Le nouveau mot de passe
     * @returns True si la réinitialisation a réussie, False si elle n'a pas réussie
     */
    public async applyResetPassword(actionCode: string, newPassword: string): Promise<string | null> {
        let errorMessage: string | null = null;
        await confirmPasswordReset(this.#auth, actionCode, newPassword).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error.code);
        })
        return errorMessage;
    }

    public async changePassword(oldPassword: string, newPassword: string): Promise<string | null> {
        let errorMessage: string | null = null;
        const user = this.#auth.currentUser;
        if (user !== null && user) {
            if (this.elementExist(user.email)) {
                let email = user.email || '';

                const credential = FirebaseAuth.EmailAuthProvider.credential(email, oldPassword);

                let isOk = await FirebaseAuth.updatePassword(user, newPassword).catch((error) => {
                    errorMessage = this.getErrorMessageFromCode(error.code);
                });

                console.log('change password', isOk);

                // Prompt the user to re-provide their sign-in credentials
                let reAuth = await FirebaseAuth.reauthenticateWithCredential(user, credential).catch((error) => {
                    errorMessage = this.getErrorMessageFromCode(error.code);
                });
                console.log('reauth', reAuth);
            }
        }
        return errorMessage;
    }

    public async createEmployee(password: string, employee: EmployeeCreateDTO): Promise<string | null> {
        let errorMessage: string | null = null;
        let createdUser = await FirebaseAuth.createUserWithEmailAndPassword(this.#auth, employee.email, password)
            .catch((error: FirebaseAuth.AuthError) => {
                errorMessage = this.getErrorMessageFromCode(error.code);
            });
        if (this.#auth.currentUser && createdUser) {
            await setDoc(doc(this.#db, `employees`, createdUser.user.uid), {...employee}).catch((error) => {
                errorMessage = this.getErrorMessageFromCode(error.code);
                if (this.#auth.currentUser) {
                    FirebaseAuth.deleteUser(this.#auth.currentUser)
                }
            })
        }
        return errorMessage;
    }

    public async createDepartment(name: string): Promise<string | null> {
        let errorMessage: string | null = null;
        let queryDepartment = query(collection(this.#db, `departments`),
            where("name", "==", name));
        let snaps = await getDocs(queryDepartment).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error.code);
        })

        let alreadyCreated = true;
        if (snaps && snaps.docs.length > 0) {
            alreadyCreated = false;
        }
        if (alreadyCreated) {
            await addDoc(collection(this.#db, `departments`), {name: name}).catch((error) => {
                errorMessage = this.getErrorMessageFromCode(error.code);
            })
        }
        return errorMessage;
    }

    public async getEmployeesByDepartment(department: string): Promise<Employee[] | string> {
        let errorMessage: string | null = null;
        let employees: Employee[] = []
        let queryDepartment = query(collection(this.#db, `employees`),
            where("department", "==", department));
        let snaps = await getDocs(queryDepartment).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error.code);
        })
        if (snaps) {
            snaps.docs.forEach((doc: QueryDocumentSnapshot) => {
                let data = doc.data();
                employees.push(new Employee({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    department: data.department,
                    jobTitles: data.jobTitles,
                    skills: data.skills,
                    role: data.role
                }))
            })
        }
        return errorMessage ?? employees;
    }

    public async getDepartments(): Promise<Department[] | string> {
        let errorMessage: string | null = null;
        let departments: Department[] = []
        let queryDepartment = query(collection(this.#db, `departments`));
        let snaps = await getDocs(queryDepartment).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error.code);
        })
        if (snaps) {
            snaps.docs.forEach((doc: QueryDocumentSnapshot) => {
                departments.push(new Department({name: doc.data().name}))
            })
        }
        return errorMessage ?? departments;
    }

    public async getRoles(): Promise<string[] | string> {
        let errorMessage: string | null = null;
        let roles: string[] = []
        let queryDepartment = query(collection(this.#db, `roles`));
        let snaps = await getDocs(queryDepartment).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error.code);
        })
        if (snaps) {
            snaps.docs.forEach((doc: QueryDocumentSnapshot) => {
                roles.push(doc.data().name)
            })
        }
        return errorMessage ?? roles;
    }

    public async getCurrentEmployeeRole(uid: string): Promise<number> {
        let employeeRole: number = 0;
        let employee = await getDoc(doc(this.#db, `employees`, uid)).catch((error) => {
            this.getErrorMessageFromCode(error.code);
        })
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
        let jobTitles: string[] = []
        let queryDepartment = query(collection(this.#db, `jobTitles`));
        let snaps = await getDocs(queryDepartment).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error.code);
        })
        if (snaps) {
            snaps.docs.forEach((doc: QueryDocumentSnapshot) => {
                jobTitles.push(doc.data().name)
            })
        }
        return errorMessage ?? jobTitles;
    }
}

export const API = new APIManager;

// @ts-ignore
window.API = API;
