import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Link, Navigate} from "react-router-dom";
import {errors, FormErrorType} from "../messages/FormMessages";
import {API} from "../api/APIManager";
import Logo from "../../deps/images/logo.png";
import {RoutesPath} from "../RoutesPath";
import FormUtils from "../utils/FormUtils";
import {loadFull} from "tsparticles";
import Particles from "react-particles";
import type {Engine} from "tsparticles-engine";
import {ParticlesOptLogin} from "../types/Particles";

interface ComponentStateLogin {
    emailLogin: string;
    passwordLogin: string;
    validated: boolean;
    error: FormErrorType;
    isLoggedIn: boolean;
}

export interface ComponentPropsLogin {
    onLoginRequest: (email: string, password: string) => Promise<boolean>;
}

export class ComponentLogin extends React.Component<ComponentPropsLogin, ComponentStateLogin> {
    public state: ComponentStateLogin = {
        emailLogin: "",
        passwordLogin: "",
        validated: false,
        error: FormErrorType.NO_ERROR,
        isLoggedIn: false,
    };

    public props: ComponentPropsLogin;

    constructor(props) {
        super(props);

        this.props = props;
    }

    public async componentDidMount(): Promise<void> {
        await this.verifyLogin();
    }

    public render(): JSX.Element {
        if (API.isAuth() && API.getCurrentEmployeeInfos().department != "") {
            return (
                <Navigate to={RoutesPath.ON_LOGIN_SUCCESS_ROUTE}/>
            );
        } else {
            return (
                <div className={"auth-form"}>
                    <Particles options={ParticlesOptLogin} init={this.#customInit}/>

                    <div className={"me-4 z-1"}>
                        <img
                            className={"mx-auto d-block mt-5"}
                            src={Logo}
                            alt={"Logo TaskMaster"}
                            width={50}
                            height={60}
                        />
                        <h4 className={"text-center mt-4 mb-4"}>Se connecter ?? TaskMaster</h4>
                    </div>
                    <Form
                        noValidate
                        validated={this.state.validated}
                        onSubmit={this.#handleSubmit}
                        onChange={this.#handleChange}
                        data-error={this.state.error}
                        className={"z-1"}
                    >
                        <Form.Group>
                            <Form.Label htmlFor={"emailLogin"} className={"mt-2"}>
                                Adresse courriel
                            </Form.Label>
                            <Form.Control
                                required
                                name="emailLogin"
                                className="row mt-1"
                                type="email"
                                pattern="^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
                                placeholder="Entrez votre adresse courriel"
                            />
                            <Form.Control.Feedback type="invalid" id="invalidLoginIdEmployee">
                                {errors.INVALID_EMAIL}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="password" className="mt-4">
                                Mot de passe{" "}
                            </Form.Label>
                            <Form.Control
                                required
                                name="passwordLogin"
                                className="row mt-1"
                                type="password"
                                placeholder="Entrez votre mot de passe"
                            />
                            <Form.Control.Feedback type="invalid" id="invalidLoginPassword">
                                {errors.REQUIRED_PASSWORD}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="me-4 mt-4 d-block text-center mx-auto">
                            <Link className="d-block" to={RoutesPath.FORGOT_PASSWORD}>
                                Mot de passe oubli?? ?
                            </Link>
                            <Button
                                data-testid="submitLogin"
                                className="mt-4"
                                variant="primary"
                                size="lg"
                                type="submit"
                                value="Submit"
                            >
                                Connexion
                            </Button>
                        </div>
                    </Form>
                </div>
            );
        }
    }

    readonly #customInit = async (engine: Engine) => {
        await loadFull(engine);
    };

    private async verifyLogin(): Promise<void> {
        await API.awaitLogin;

        if (API.isAuth()) {
            this.setState({
                isLoggedIn: true,
            });
        }
    }

    readonly #handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        let errorType = FormUtils.validateForm(event);

        this.setState({
            validated: true,
            error: errorType,
        });

        if (errorType === FormErrorType.NO_ERROR) {
            let isLoggedIn: boolean = await this.props.onLoginRequest(this.state.emailLogin, this.state.passwordLogin);

            this.setState({
                ...this.state, ...{
                    isLoggedIn: isLoggedIn,
                }
            });
        }
    };

    readonly #handleChange = (event: React.ChangeEvent<HTMLFormElement>): void => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        if (!name) {
            throw new Error("Name is undefined for element in form.");
        }

        this.setState({
            ...this.state, ...{
                [name]: value,
            }
        });
    };
}
