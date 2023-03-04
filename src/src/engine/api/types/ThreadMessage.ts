import {Employee} from "../../types/Employee";

/**
 * ThreadMessage class for communication between the main thread and the service worker.
 */
export interface ThreadMessage {
    type: ThreadMessageType;
    taskId: string | null;
    data?: any;
}

/**
 * Data for creating a new account.
 */
export interface AccountCreationData {
    employee: Employee;
    password: string;
}

/**
 * Data for a task.
 */
export interface Task {
    callback: (data: any) => void;
}

/**
 * Data for a created account.
 */
export interface CreatedAccountData {
    error?: string;
    createdUser?: {
        userId: string;
    };
}

/**
 * Thread message type.
 */
export enum ThreadMessageType {
    INIT = 0,
    CREATE_NEW_ACCOUNT = 1,
    TASK_RESPONSE = 2,
}
