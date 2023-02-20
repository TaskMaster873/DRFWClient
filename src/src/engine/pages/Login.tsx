import React from "react";
import {Container} from "react-bootstrap";
import {ComponentLogin} from "../components/ComponentLogin";
import {API} from "../api/APIManager";
import {errors, successes} from "../messages/FormMessages";
import {NotificationManager} from 'react-notifications';

/***
 *
 * Page de connexion
 *
 */
export class Login extends React.Component {
    public componentDidMount() {
        document.title = "Connexion - TaskMaster";
    }

    private async onLoginRequest(email: string, password: string) : Promise<boolean> {
        let errorMessage = await API.loginWithPassword(email, password);

        if (errorMessage === null) {
            NotificationManager.success(successes.LOGIN_SUCCESS, successes.SUCCESS_GENERIC_MESSAGE);
        } else {
            NotificationManager.error(errorMessage, errors.ERROR_GENERIC_MESSAGE);
        }

        return errorMessage === null;
    }

    public render(): JSX.Element {
        return (
            <Container>
                <ComponentLogin onLoginRequest={this.onLoginRequest} />
            </Container>
        );
    }
}
