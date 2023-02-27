import {Logger} from "../Logger";
import {getDocs} from "firebase/firestore";
import {errors} from "../messages/APIMessages";

export class APIUtils extends Logger {

    /**
     * This method parse firebase error codes and return a human-readable error message.
     * @param error The error to parse.
     * @returns {string} The human-readable error message.
     */
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
 * Instantiate the APIManager class and export it as a singleton.
 */
export const Utils = new APIUtils();

// @ts-ignore
window.Utils = Utils;
