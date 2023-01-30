import React from "react";
import { Logger } from "../Logger";
// @ts-ignore
import Icecream from "../../deps/images/bing-chilling.jpg";

/**
 * Cette classe ne sert à rien
 */
export class Memes extends React.Component {
  private logger: Logger = new Logger(`Memes`, `#20f6a4`, false);

  public componentDidMount() {
    document.title = "Memes - TaskMaster";
  }

  public render(): JSX.Element {
    return (
      <div>
        <h2 className="text-center m-4">Bing Chilling</h2>
        <img className="image-fluid" src={Icecream} alt="Bing Chilling" />
      </div>
    );
  }
}
