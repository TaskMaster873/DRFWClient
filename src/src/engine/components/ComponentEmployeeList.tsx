import React from "react";
import { EmployeeList } from "../types/EmployeeList";

export class ComponentEmployeeList extends React.Component {
  private list: string[] = [];
  constructor(props: EmployeeList) {
    super(props);
    this.list = props.list;
  }

  public render(): JSX.Element {
    return (
      <div className="container">
        <div>
          {this.list.map((elem) => (
            <div>{elem}</div>
          ))}
        </div>
      </div>
    );
  }
}
