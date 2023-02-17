import {Employee} from "../../types/Employee";
import * as FirebaseAuth from "firebase/auth";

export interface ThreadMessage {
    type: ThreadMessageType;
    taskId: string | null;
    data?: any;
}

export interface AccountCreationData {
    employee: Employee;
    password: string;
}

export interface Task {
    callback: (data: any) => void;
}

export interface CreatedAccountData {
    error?: string;
    createdUser?: {
        userId: string;
    };
}

export enum ThreadMessageType {
    INIT = 0,
    CREATE_NEW_ACCOUNT = 1,
    TASK_RESPONSE = 2,
}