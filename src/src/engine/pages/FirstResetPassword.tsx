import React from "react";
import {Container} from "react-bootstrap";
import {ComponentChangePassword} from "../components/ComponentChangePassword";

/**
 * If the user just logged in for the first time, he will be redirected to this page and will be asked to change his password.
 */
export class FirstResetPassword extends React.Component<unknown, unknown> {
    public componentDidMount() {
        document.title = "Protéger votre compte - TaskMaster";
    }

    public render(): JSX.Element {
        return (
            <Container>
                <ComponentChangePassword />
            </Container>
        );
    }
}
