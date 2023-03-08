import React from "react";
import {Container} from "react-bootstrap";
import {ComponentChangePassword} from "../components/ComponentChangePassword";
import {Engine} from "tsparticles-engine";
import {loadFull} from "tsparticles";
import {ParticlesOpts} from "../types/Particles";
import Particles from "react-particles";
import {API} from "../api/APIManager";
import {RoutesPath} from "../RoutesPath";
import {Navigate} from "react-router-dom";
import { NotificationManager } from "../api/NotificationManager";
import { errors } from "../messages/FormMessages";
import { Roles } from "../types/Roles";

interface ChangePasswordState {
    redirectTo: string | null;
}

/**
 * La page pour changer le mot de passe
 */
export class ChangePassword extends React.Component<unknown, ChangePasswordState> {
    public state: ChangePasswordState = {
        redirectTo: null
    };


    public async componentDidMount() {
        document.title = "Changement de mot de passe - TaskMaster";

        let isLoggedIn: boolean = await this.verifyLogin();

        if (!isLoggedIn) {
            NotificationManager.warn(errors.SORRY, errors.NO_PERMISSION);
        }
    }

    constructor(props: unknown) {
        super(props);

        API.subscribeToEvent(this.onEvent.bind(this));
    }

    /**
     *
     * @returns Le composant pour faire le changement de mot de passe
     */
    public render(): JSX.Element {
        if (this.state.redirectTo) {
            return (<Navigate to={this.state.redirectTo}/>);
        }
        return (
            <Container>
                <Particles options={ParticlesOpts} init={this.#customInit}/>
                <ComponentChangePassword/>
            </Container>
        );
    }

    /**
     * Initialization of particlesJS on the page
     * @param engine
     * @private
     */
    readonly #customInit = async (engine: Engine) => {
        await loadFull(engine);
    };

    private async onEvent(): Promise<void> {
        await this.verifyLogin();
    }

    /**
     * Verify if the user is logged in
     * @private
     */
    private async verifyLogin(): Promise<boolean> {
        let isLoggedIn: boolean = false;
        await API.awaitLogin;

        // @ts-ignore
        const hasPerms = API.hasPermission(Roles.EMPLOYEE);
        if (!API.isAuth() || !hasPerms) {
            this.redirectTo(RoutesPath.INDEX);
        } else {
            isLoggedIn = true;
        }

        return isLoggedIn;
    }

    /**
     * Redirect to a path
     * @param path
     * @private
     */
    private redirectTo(path: string): void {
        this.setState({
            redirectTo: path
        });
    }
}
