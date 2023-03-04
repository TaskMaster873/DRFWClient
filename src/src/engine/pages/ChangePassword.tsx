import React from "react";
import {Container} from "react-bootstrap";
import {ComponentChangePassword} from "../components/ComponentChangePassword";

/**
 * La page pour changer le mot de passe
 */
export class ChangePassword extends React.Component {
    public componentDidMount() {
        document.title = "Changement de mot de passe - TaskMaster";
    }
    /**
     *
     * @returns Le composant pour faire le changement de mot de passe
     */
    public render(): JSX.Element {
        return (
            <Container>
                <ComponentChangePassword />
            </Container>
        );
    }
}
