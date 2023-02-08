import React from "react";
import {Container} from "react-bootstrap";
import {ComponentResetPassword} from "../components/ComponentResetPassword";

/**
 * C'est la page pour changer le mot de passe
 */
export class ResetPassword extends React.Component {
    public componentDidMount() {
        document.title = "Réinitialisation de mot de passe - TaskMaster";
    }
    /**
     *
     * @returns Le composant pour faire le changement de mot de passe
     */
    public render(): JSX.Element {
        return (
            <Container>
                <ComponentResetPassword />
            </Container>
        );
    }
}
