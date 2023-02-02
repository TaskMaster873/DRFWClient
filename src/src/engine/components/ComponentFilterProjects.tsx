import React from "react";
import { ScheduleGroup } from "../types/Schedule";
/**
 * 
 * Classe qui permet de faire afficher les employé selon les bons groupes (projets)
 */
export class ResourceGroups extends React.Component<{ groups: ScheduleGroup[], onChange: any }> {
  private selectRef: React.RefObject<HTMLSelectElement>;
  private groups: ScheduleGroup[];
  private onChange: any;

  constructor(props: { groups: ScheduleGroup[], onChange: any }) {
    super(props);
    this.groups = props.groups;
    this.onChange = props.onChange;
    this.selectRef = React.createRef();
  }

  find(id: string) {
    if (!this.props) {
      return null;
    }
    return this.groups.find((item) => item.id === id);
  }

  componentDidMount() {
    if (this.groups && this.groups.length > 0) {
      setTimeout(() => this.doOnChange(this.groups.at(0)), 0);
    }
  }

  render() {
    return (
      <span>
        Group: &nbsp;
        <select onChange={(ev) => this.change(ev)} ref={this.selectRef}>
          {this.groups.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </span>
    );
  }

  change(ev: React.ChangeEvent<HTMLSelectElement>) {
    const value = ev.target.value;
    const item = this.find(value);
    this.doOnChange(item);
  }

  doOnChange(location: ScheduleGroup | undefined | null) {
    const args = { selected: location };
    if (this.onChange) {
      this.onChange(args);
    }
  }
}
