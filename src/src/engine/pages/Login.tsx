import React from "react";
import { Logger } from "../Logger";

export class Login extends React.Component {
    private logger: Logger = new Logger(`Login`, `#20f6a4`, false);

    public componentDidMount() {
        document.title = 'Login'
    }

    public render() : JSX.Element {
        this.logger.log(`Rendering Index...`);

        return <div>Login Page</div>
    }

    // do stuff...
}