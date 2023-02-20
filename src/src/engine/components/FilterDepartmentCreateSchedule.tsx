import React from "react";
import {ScheduleGroup} from "../types/Schedule";

interface FilterDepartmentCreateScheduleProps {
    groups: ScheduleGroup[],
    onChange: (group: ScheduleGroup) => void;
}

interface FilterDepartmentCreateScheduleState {
    temporary: string;
}

/**
 * Component that will filter the list of departments for the create schedule page
 * @class FilterDepartmentCreateSchedule
 * @extends {React.Component<EmployeeListProps, EmployeeListState>}
 * @param {EmployeeListProps} props
 * @param {EmployeeListState} state
 * @memberof FilterDepartmentCreateSchedule
 */
export class FilterDepartmentCreateSchedule extends React.Component<FilterDepartmentCreateScheduleProps, FilterDepartmentCreateScheduleState> {
    private selectRef: React.RefObject<HTMLSelectElement> = React.createRef();

    constructor(props: FilterDepartmentCreateScheduleProps) {
        super(props);
    }


    private find(id: string): ScheduleGroup | undefined | null {
        if (!this.props) {
            return null;
        }

        return this.props.groups.find((item) => item.id === id);
    }

    public componentDidMount() {
        if (this.props.groups && this.props.groups.length > 0) {
            setTimeout(() => this.doOnChange(this.props.groups.at(0)), 0);
        }
    }

    public render() : JSX.Element {
        return (
            <span>
                Department: &nbsp;
                <select onChange={(changeDepartment) => this.#changeDeparment(changeDepartment)} ref={this.selectRef}>
                    {
                        this.props.groups.map((item) => (<option key={item.id} value={item.id}> {item.name} </option>)
                    )}
                </select>
            </span>
        );
    }

    readonly #changeDeparment = (ev: React.ChangeEvent<HTMLSelectElement>): void => {
        const value = ev.target.value;
        const item = this.find(value);
        this.doOnChange(item);
    }

    readonly doOnChange = (location: ScheduleGroup | undefined | null): void => {
        const args = { selected: location };

        throw new Error("Not implemented");
    }
}
