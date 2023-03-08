import {Container} from "react-bootstrap";
import {ComponentForgotPassword} from "../components/ComponentForgotPassword";
import {Engine} from "tsparticles-engine";
import {loadFull} from "tsparticles";
import {ParticlesOpts} from "../types/Particles";
import Particles from "react-particles";
import React from "react";

/**
 * La page pour envoyer le courriel de réinitialisation de mot de passe
 */
export function ForgotPassword() {
    document.title = "Mot de passe oublié - TaskMaster";

    const customInit = async (engine: Engine) => {
        await loadFull(engine);
    };

    /**
     *
     * @returns Le composant pour envoyer le courriel de réinitialisation de mot de passe
     */
    return (
        <Container>
            <Particles options={ParticlesOpts} init={customInit}/>
            <ComponentForgotPassword/>
        </Container>
    );
}
