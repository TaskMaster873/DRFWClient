import React from "react";
import { ComponentLogin } from "../components/homepage/ComponentLogin";
import { Logger } from "../Logger";

export class LoginPage extends React.Component {
    private logger: Logger = new Logger(`Login`, `#20f6a4`, false);

    public componentDidMount() {
        document.title = 'LoginPage'
    }

    public render() : JSX.Element {
        this.logger.log(`Rendering Index...`);

        return <div>Login Page</div>
    }   
}