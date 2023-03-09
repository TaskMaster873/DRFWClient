import {Logger} from "../Logger";
import {getDocs} from "firebase/firestore";
import {errors} from "../messages/APIMessages";

/**
 * The InternalAPIUtils is responsible for storing useful methods often used in the API.
 * It is a singleton class, this allows us to have a single instance of the APIUtils and use it throughout the application.
 * @class InternalAPIUtils
 * @extends Logger
 */
export class InternalAPIUtils extends Logger {

    /**
     * This method parse firebase error codes and return a human-readable error message.
     * @memberof InternalAPIUtils
     * @param error The error to parse.
     * @returns {string} The human-readable error message.
     */
    public getErrorMessageFromCode(error: Error | string): string {
        let errorMessage: string = errors.DEFAULT;
        let message: string;

        if (typeof error === "string") {
            message = error;
            if(message.includes("Firebase: Error (auth/email-already-in-use).")) {
                errorMessage = errors.EMPLOYEE_EMAIL_ALREADY_USED;
            }
        } else {
            message = error.message;
            switch (message) {
                case "Firebase: Error (auth/invalid-email).":
                    errorMessage = errors.INVALID_LOGIN;
                    break;
                case "Firebase: Error (auth/user-not-found).":
                    errorMessage = errors.INVALID_LOGIN;
                    break;
                case "Firebase: Error (auth/wrong-password).":
                    errorMessage = errors.INVALID_LOGIN;
                    break;
                case "Firebase: Error (auth/email-already-in-use).":
                    errorMessage = errors.EMPLOYEE_EMAIL_ALREADY_USED;
                    break;
                case "Firebase: Error (permission-denied).":
                    errorMessage = errors.PERMISSION_DENIED;
                    break;
            }
        }

        this.error(
            `Erreur: ${errorMessage} Code: ${error} Message: ${message}`
        );
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
    public async checkIfAlreadyExists(query, error: string): Promise<string | null> {
        let errorMessage: string | null = null;
        let snaps = await getDocs(query).catch((error) => {
            errorMessage = this.getErrorMessageFromCode(error);
        });
        if (snaps && snaps.docs.length > 0) {
            errorMessage = error;
        }
        return errorMessage;
    }
}

/**
 * Instantiate the APIUtils class and export it as a singleton.
 */
export const APIUtils = new InternalAPIUtils();

// @ts-ignore
window.APIUtils = APIUtils;
