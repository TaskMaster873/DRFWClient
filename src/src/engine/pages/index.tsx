import React from "react";
import { Logger } from "../Logger";

export class Index extends React.Component {
  private logger: Logger = new Logger(`IndexPage`, `#20f6a4`, false);

  public componentDidMount() {
    document.title = "Acceuil - Task Manager";
  }

  public render(): JSX.Element {
    return <div className="container"></div>;
  }
}
