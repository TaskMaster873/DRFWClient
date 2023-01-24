import React from "react";
import { Logger } from "../../Logger";
import '../../../deps/css/bootstrap.min.css';


export class ComponentLogin extends React.Component {
    private logger: Logger = new Logger(`MyFunComponent`, `#20f6a4`, false);

    public render(): JSX.Element {
        this.logger.log(`Rendering my fun component...`);

        return this.yourComponent();

    }

    private yourComponent() : JSX.Element {
        return  (
        <div className = "container">
        <form>
        <label htmlFor="fname">No employe:</label>
        <input type="text" id="fname" name="fname"/>
         <label htmlFor="lname">Last name:</label>
        <input type="text" id="lname" name="lname"></input>
         </form>
        </div>);
    }


}