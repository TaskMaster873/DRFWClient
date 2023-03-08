import React from "react";
import {Container} from "react-bootstrap";
import {ComponentChangePassword} from "../components/ComponentChangePassword";
import {Engine} from "tsparticles-engine";
import {loadFull} from "tsparticles";
import {ParticlesOpts} from "../types/Particles";
import Particles from "react-particles";

/**
 * La page pour changer le mot de passe
 */
export class ChangePassword extends React.Component {
    public componentDidMount() {
        document.title = "Changement de mot de passe - TaskMaster";
    }

    readonly #customInit = async (engine: Engine) => {
        await loadFull(engine);
    };

    /**
     *
     * @returns Le composant pour faire le changement de mot de passe
     */
    public render(): JSX.Element {
        return (
            <Container>
                <Particles options={ParticlesOpts} init={this.#customInit} />
                <ComponentChangePassword/>
            </Container>
        );
    }
}
