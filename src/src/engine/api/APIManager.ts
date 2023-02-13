import {Logger} from "../Logger";

import {FirebaseApp, initializeApp} from "firebase/app";
import {Analytics, getAnalytics, isSupported} from "firebase/analytics";

import * as FirebaseAuth from "firebase/auth";
import {addDoc, collection, doc, Firestore, getDoc, getDocs, getFirestore, query, where} from "firebase/firestore";
import {FirebasePerformance, getPerformance} from "firebase/performance";
import {firebaseConfig} from "./config/FirebaseConfig";
import {Employee, EmployeeCreateDTO} from "../types/Employee";
import {Errors} from "./errors/Errors";
import {Department} from "../types/Department";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { Shift, ShiftDTO } from "../types/Shift";

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
    #userRole: string | null = null;

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
        return this.#userRole == "Administrateur";
    }

    public async loginWithPassword(email: string, password: string): Promise<FirebaseAuth.UserCredential | null> {
        await API.awaitLogin;

        if (FirebaseAuth !== null && FirebaseAuth) {
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
        } else {
            return null;
        }
    }

    public async sendResetPassword(email: string): Promise<boolean> {
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

        this.awaitLogin = new Promise(async (resolve) => {
            FirebaseAuth.onAuthStateChanged(this.#auth, async (user) => {
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
        public async verifyResetPassword(actionCode: string): Promise<string> {
            return new Promise(async (resolve) => {
                let accountEmail: string = "None";
                await verifyPasswordResetCode(this.#auth, actionCode).then((email) => {
                    accountEmail = email;
                }).catch((error) => {
                    this.error(error)
                })
                resolve(accountEmail);
            })
        }
    
        /**
         * Valide le code de réinitialisation de mot de passe et applique le nouveau mot de passe
         * @param actionCode Le code de réinitialisation de mot de passe
         * @param newPassword Le nouveau mot de passe
         * @returns True si la réinitialisation a réussie, False si elle n'a pas réussie
         */
        public async applyResetPassword(actionCode: string, newPassword: string): Promise<boolean> {
            return new Promise(async (resolve) => {
                let resetSuccess: boolean = false;
                await confirmPasswordReset(this.#auth, actionCode, newPassword).then(() => {
                    resetSuccess = true;
                }).catch((error) => {
                    this.error(error)
                })
                resolve(resetSuccess);
            })
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

    public async createEmployee(password: string, employee: EmployeeCreateDTO): Promise<boolean> {
        return new Promise(async (resolve) => {
            let created = true;
            await FirebaseAuth.createUserWithEmailAndPassword(this.#auth, employee.email, password).then(async () => {
                if (this.#auth.currentUser) {
                    await addDoc(collection(this.#db, `employees`), {...employee}).catch((e) => {
                        this.error(e);
                        created = false;
                        if (this.#auth.currentUser) {
                            FirebaseAuth.deleteUser(this.#auth.currentUser)
                        }
                    })
                }
            }).catch((e: FirebaseAuth.AuthError) => {
                this.error(e);
                created = false;
            });
            resolve(created);
        });
    }

    public async createDepartment(name: string): Promise<boolean> {
        return new Promise(async (resolve) => {
            let created = true;
            let queryDepartment = query(collection(this.#db, `departments`), where("name", "==", name));
            let snaps = await getDocs(queryDepartment).catch((e) => {
                this.error(e);
            })
            if (snaps && snaps.docs.length > 0) {
                created = false;
            }
            if (created) {
                await addDoc(collection(this.#db, `departments`), {name: name}).catch((e) => {
                    this.error(e);
                    created = false;
                })
            }
            resolve(created);
        });
    }

    public async getEmployeesByDepartment(department: string): Promise<Employee[]> {
        let employees: Employee[] = []
        return new Promise(async (resolve) => {
            let queryDepartment = query(collection(this.#db, `employees`), where("department", "==", department));
            let snaps = await getDocs(queryDepartment).catch((e) => {
                this.error(e);
            })
            if(snaps) {
                snaps.docs.forEach((doc) => {
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

            resolve(employees);
        });
    }

    public async getDepartments(): Promise<Department[]> {
        let departments: Department[] = []
        return new Promise(async (resolve) => {
            let queryDepartment = query(collection(this.#db, `departments`));
            let snaps = await getDocs(queryDepartment).catch((e) => {
                this.error(e);
            })
            if(snaps) {
                snaps.docs.forEach((doc) => {
                    departments.push(new Department({name: doc.data().name}))
                })
            }
            resolve(departments);
        });
    }

    public async getRoles(): Promise<string[]> {
        let roles: string[] = []
        return new Promise(async (resolve) => {
            let queryDepartment = query(collection(this.#db, `roles`));
            let snaps = await getDocs(queryDepartment).catch((e) => {
                this.error(e);
            })
            if(snaps) {
                snaps.docs.forEach((doc) => {
                    roles.push(doc.data().name)
                })
            }
            resolve(roles);
        });
    }

    public async getCurrentEmployeeRole(uid: string) : Promise<string> {
        let employeeRole : string = (await this.getRoles())[0];
            let employee = await getDoc(doc(this.#db, `roles`, uid)).catch((e) => {
                this.error(e);
            })
            if(employee && employee.data() != undefined) {
                let employeeData = employee.data();
                if(employeeData != undefined) {
                    employeeRole = employeeData.role;
                }
            }
            return employeeRole;
    }

    public async getJobTitles(): Promise<string[]> {
        let jobTitles: string[] = []
            let queryDepartment = query(collection(this.#db, `jobTitles`));
            let snaps = await getDocs(queryDepartment).catch((e) => {
                this.error(e);
            })
            if(snaps) {
                snaps.docs.forEach((doc) => {
                    jobTitles.push(doc.data().name)
                })
            }
            return jobTitles;
    }

    public async getScheduleForOneEmployee(): Promise<Shift[]> {
        let shifts: Shift[] = [];
        if(this.isAuthenticated){
            return new Promise(async (resolve) => {
                let queryShifts = query(collection(this.#db, `shifts`), where("employeeId", "==", "123" /*this.#user?.uid*/));
                let snaps = await getDocs(queryShifts).catch((e) => {
                    console.log("error");
                    this.error(e);
                })
                if(snaps) {
                    snaps.docs.forEach((doc) => {
                        let data = doc.data();
                        shifts.push(new Shift({
                            employeeId: data.employeeId,
                            projectName: data.projectName,
                            start: data.start,
                            end: data.end,
                        }))
                    })
                }
                resolve(shifts);
            });
        } else {
            return shifts;
        }
        
    }
}

export const API = new APIManager;

// @ts-ignore
window.API = API;
