import React from "react";
import { Container } from "react-bootstrap";
import { ComponentAddEmployee } from "../components/ComponentAddEmployee";
import { Logger } from "../Logger";
import { JobTitleList } from "../types/JobTitleList";

export class AddEmploye extends React.Component {
  private logger: Logger = new Logger(`Employees`, `#20f6a4`, false);
  private list: string[] = ["Menusier", " Plombier"];

  public componentDidMount() {
    document.title = "Ajouter un Employé - Task Manager";
  }

  public render(): JSX.Element {
    let listData: JobTitleList = { list: this.list };
    return <Container className="mt-3"><ComponentAddEmployee {...listData} /></Container>;
  }
}