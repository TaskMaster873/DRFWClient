import React from "react";
import {ScheduleGroup} from "../types/Schedule";

/**
 *
 * Classe qui permet de faire afficher les employés selon les bons groupes (projets)
 */
export class ResourceGroups extends React.Component<{ groups: ScheduleGroup[], onChange: any }> {
    private selectRef: React.RefObject<HTMLSelectElement> = React.createRef();
    private groups: ScheduleGroup[];
    private onChange: any;

    constructor(props: { groups: ScheduleGroup[], onChange: any }) {
        super(props);
        this.groups = props.groups;
        this.onChange = props.onChange;
    }

    private find(id: string) {
        if (!this.props) {
            return null;
        }
        return this.groups.find((item) => item.id === id);
    }

    public componentDidMount() {
        if (this.groups && this.groups.length > 0) {
            setTimeout(() => this.doOnChange(this.groups.at(0)), 0);
        }
    }

    public render() : JSX.Element {
        return (
            <span>
        Department: &nbsp;
                <select onChange={(changeDepartment) => this.change(changeDepartment)} ref={this.selectRef}>
          {this.groups.map((item) => (
              <option key={item.id} value={item.id}>
                  {item.name}
              </option>
          ))}
        </select>
      </span>
        );
    }

    private change(ev: React.ChangeEvent<HTMLSelectElement>): void {
        const value = ev.target.value;
        const item = this.find(value);
        this.doOnChange(item);
    }

    private doOnChange(location: ScheduleGroup | undefined | null): void {
        const args = { selected: location };
        if (this.onChange) {
            this.onChange(args);
        }
    }
}
