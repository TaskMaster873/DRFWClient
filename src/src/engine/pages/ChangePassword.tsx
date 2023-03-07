import React from "react";
import {Container} from "react-bootstrap";
import {ComponentChangePassword} from "../components/ComponentChangePassword";
import {API} from "../api/APIManager";
import {Roles} from "../types/Roles";
import {RoutesPath} from "../RoutesPath";
import {Navigate} from "react-router-dom";

export interface ChangePasswordState {
    redirectTo: string | null;
}

/**
 * La page pour changer le mot de passe
 */
export class ChangePassword extends React.Component<unknown, ChangePasswordState> {
    public state: ChangePasswordState = {
        redirectTo: null
    }

    public componentDidMount() {
        document.title = "Changement de mot de passe - TaskMaster";
    }

    constructor(props) {
        super(props);

        API.subscribeToEvent(this.onEvent.bind(this));
    }

    private async onEvent() : Promise<void> {
        await this.verifyLogin();
    }

    /**
     * Verify if the user is logged in
     * @private
     */
    private async verifyLogin(): Promise<boolean> {
        let isLoggedIn: boolean = false;
        await API.awaitLogin;

        const hasPerms = API.hasPermission(Roles.EMPLOYEE);
        if (!API.isAuth() || !hasPerms) {
            this.setState({
                redirectTo: RoutesPath.INDEX
            });
        } else {
            isLoggedIn = true;
        }

        return isLoggedIn;
    }

    /**
     *
     * @returns Le composant pour faire le changement de mot de passe
     */
    public render(): JSX.Element {
        if (this.state.redirectTo) {
            return (<Navigate to={this.state.redirectTo}/>);
        } else {
            return (
                <Container>
                    <ComponentChangePassword/>
                </Container>
            );
        }
    }
}
