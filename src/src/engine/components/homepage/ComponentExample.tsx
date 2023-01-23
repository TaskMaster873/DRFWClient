import React from "react";
import { Logger } from "../../Logger";

export class ComponentExample extends React.Component {
    private logger: Logger = new Logger(`MyFunComponent`, `#20f6a4`, false);

    public render() : JSX.Element {
        this.logger.log(`Rendering my fun component...`);

        return <div>This is a fun component</div>
    }

    // do stuff...
}