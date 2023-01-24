import React from "react";
import { Logger } from "../Logger";

export class Index extends React.Component {
    private logger: Logger = new Logger(`IndexPage`, `#20f6a4`, false);

    public componentDidMount() {
        document.title = 'Index';
    }

    public render() : JSX.Element {
        this.logger.log(`Rendering Index...`);

        return <div className="container"></div>
    }

    // do stuff...
}