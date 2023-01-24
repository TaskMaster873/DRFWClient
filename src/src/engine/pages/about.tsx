import React from "react";
import { Logger } from "../Logger";

export class About extends React.Component {
  private logger: Logger = new Logger(`Engine`, `#20f6a4`, false);

  public componentDidMount() {
    document.title = "À propos - Task Manager";
  }

  public render(): JSX.Element {
    return <div>About Page</div>;
  }
}
