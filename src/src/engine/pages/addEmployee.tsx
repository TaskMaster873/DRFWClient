import React from "react";
import { Container } from "react-bootstrap";
import { ComponentAddEmployee } from "../components/ComponentAddEmployee";
import { Logger } from "../Logger";
import { RolesList } from "../types/Roles";

export class AddEmployee extends React.Component {
  private logger: Logger = new Logger(`AddEmployee`, `#20f6a4`, false);
  private titles: string[] = ["Menusier", "Plombier"];
  private roles: string[] = ["Employé", "Administrateur"];

  public componentDidMount() {
    document.title = "Ajouter un Employé - Task Manager";
  }

  public render(): JSX.Element {
    let rolesList: RolesList = { roles: this.roles };
    return (
      <Container className="mt-3">
        <ComponentAddEmployee
          {...{ roles: rolesList.roles, titles: this.titles }}
        />
      </Container>
    );
  }
}
