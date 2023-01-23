import React from "react";
import { Logger } from "../Logger";

export class About extends React.Component {
    private logger: Logger = new Logger(`Engine`, `#20f6a4`, false);

    public componentDidMount() {
        document.title = 'About'
    }

    public render() : JSX.Element {
        this.logger.log(`Rendering Index...`);

        return <div>About Page</div>
    }

    // do stuff...
}