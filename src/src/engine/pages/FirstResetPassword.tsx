import React from "react";
import {Container} from "react-bootstrap";
import {ComponentChangePassword} from "../components/ComponentChangePassword";

interface FirstResetPasswordProps {
    onChangePasswordCallbackParent: () => void;
}

/**
 * If the user just logged in for the first time, he will be redirected to this page and will be asked to change his password.
 */
export class FirstResetPassword extends React.Component<FirstResetPasswordProps, unknown> {
    constructor(public props: FirstResetPasswordProps) {
        super(props);
    }

    public componentDidMount() {
        document.title = "Protéger votre compte - TaskMaster";
    }

    public render(): JSX.Element {
        return (
            <Container>
                <ComponentChangePassword onChangePasswordCallback={this.#onChangePasswordCallback} />
            </Container>
        );
    }

    /**
     * This function is called when the user changes his password.
     * @private
     */
    readonly #onChangePasswordCallback = (): void => {
        this.props.onChangePasswordCallbackParent();
    };
}
