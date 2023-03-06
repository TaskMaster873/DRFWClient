import React from "react";
import {Container} from "react-bootstrap";
import {ComponentLogin} from "../components/ComponentLogin";
import {API} from "../api/APIManager";
import {errors, successes} from "../messages/FormMessages";
import {NotificationManager} from "../api/NotificationManager";

/**
 * Login page.
 */
export class Login extends React.Component<unknown, unknown> {
    public componentDidMount() {
        document.title = "Connexion - TaskMaster";
    }

    public render(): JSX.Element {
        return (
            <Container>
                <ComponentLogin onLoginRequest={this.#onLoginRequest}/>
            </Container>
        );
    }

    /**
     * This function is called when the user wants to login.
     * @param email - The email of the user
     * @param password - The password of the user
     * @private
     * @return {Promise<boolean>} - True if the login was successful, false otherwise
     * @async
     */
    readonly #onLoginRequest = async (email: string, password: string): Promise<boolean> => {
        let errorMessage = await API.loginWithPassword(email, password);

        if (errorMessage === null) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.LOGIN_SUCCESS);
        } else {
            NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, errorMessage);
        }

        return errorMessage === null;
    };
}
