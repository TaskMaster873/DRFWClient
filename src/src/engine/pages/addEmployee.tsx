import React from "react";
import { ComponentAddEmployee } from "../components/ComponentAddEmployee";
import { RolesList } from "../types/Role";

/**
 * Ceci est la page pour ajouter un employé
 */
export class AddEmployee extends React.Component {
  private titles: string[] = ["Menuisier", "Plombier"];
  private roles: string[] = ["Employé", "Administrateur"];

  public componentDidMount() {
    document.title = "Ajouter un Employé - TaskMaster";
  }

  /**
   *
   * @returns ComponentAddEmployee avec la liste de titre et celle de role
   */
  public render(): JSX.Element {
    let rolesList: RolesList = { roles: this.roles };
    return (
      <ComponentAddEmployee
        {...{ roles: rolesList.roles, titles: this.titles }}
      />
    );
  }
}
