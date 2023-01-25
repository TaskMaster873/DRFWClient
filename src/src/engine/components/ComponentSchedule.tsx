import React from "react";
import Table from 'react-bootstrap/Table';
import { EmployeeList } from "../types/EmployeeList";

export class ComponentSchedule extends React.Component {
  private list: string[] = [];
  constructor(props: EmployeeList) {
    super(props);
    this.list = props.list;
  }

  public render(): JSX.Element {
    return (
        <Table responsive>
          <thead>
            <tr>
              <th>Heures de la journée</th>
              {Array.from({ length: this.list.length }).map((_, index) => (
                <th key={index}>{this.list[index]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              {Array.from({ length: this.list.length }).map((_, index) => (
                <td key={index}>Table cell {index}</td>
              ))}
            </tr>
            <tr>
              <td>2</td>
              {Array.from({ length: this.list.length }).map((_, index) => (
                <td key={index}>Table cell {index}</td>
              ))}
            </tr>
            <tr>
              <td>3</td>
              {Array.from({ length: this.list.length }).map((_, index) => (
                <td key={index}>Table cell {index}</td>
              ))}
            </tr>
          </tbody>
        </Table>
      );
  }
}