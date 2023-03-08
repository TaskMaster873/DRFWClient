import React from "react";
import Container from "react-bootstrap/Container";
import {LinkContainer} from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import Logo from "../../deps/images/logo.png";
import {API} from "../api/APIManager";
import {RoutesPath} from "../RoutesPath";
import {Navigate} from "react-router-dom";
import Row from "react-bootstrap/Row";
import { loadFull } from "tsparticles";
import Particles from "react-particles";
import type { Engine } from "tsparticles-engine";
import {ParticlesOpts} from "../types/Particles";

export class ComponentHomePage extends React.PureComponent<unknown, unknown> {
    private isMounted: boolean = false;
    constructor(props) {
        super(props);

        API.subscribeToEvent(this.onEvent.bind(this));
    }

    public componentDidMount() {
        this.isMounted = true;
    }

    public componentWillUnmount() {
        this.isMounted = false;
    }

    readonly #customInit = async (engine: Engine) => {
        await loadFull(engine);
    };

    public render(): JSX.Element {
        if (API.isAuth() && API.hasChangedDefaultPassword) {
            return (
                <Navigate to={RoutesPath.SCHEDULE}></Navigate>
            );
        } else {
            return (
                <Container>
                    <Row className={"justify-content-md-center"}>
                        <Particles options={ParticlesOpts} init={this.#customInit} />
                        <div className="mt-6 mb-4 mt-4 z-1">
                            <h1><img
                                className="me-3"
                                src={Logo}
                                alt="Logo TaskMaster"
                                width={150}
                                height={190}
                            />TaskMaster</h1>
                        </div>

                        <div className="text-center mt-4 mb-4 text-home-page-description z-1">
                            TaskMaster est un gestionnaire d'horaire pour entreprise.
                            En tant qu'application web, TaskMaster est accessible partout et permet à une entreprise de
                            mieux gérer ses effectifs.
                        </div>

                        <div className="me-4 mt-4 d-block text-center justify-content-center mx-auto z-1">
                            <LinkContainer to={RoutesPath.LOGIN}>
                                <Button
                                    data-testid="submitLogin"
                                    className="mt-4 btn-dark"
                                    variant="primary"
                                    size="lg"
                                    type="submit"
                                    value="Submit"
                                >
                                    Connexion
                                </Button>
                            </LinkContainer>
                        </div>
                    </Row>
                </Container>
            );
        }
    }

    /**
     * This method is called when the API emits an event.
     * @private
     * @return {Promise<void>} - A promise that resolves when the state is updated
     */
    private async onEvent(): Promise<void> {
        return new Promise((resolve) => {
            if (this.isMounted) {
                this.setState({}, () => {
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
}
