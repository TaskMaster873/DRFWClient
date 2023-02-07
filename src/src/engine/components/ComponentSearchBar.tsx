import React from "react";
import {Form} from "react-bootstrap";
import {Employee, EmployeeList} from "../types/Employee";

export class ComponentSearchBar extends React.Component {
    public state: { searchTerm: string, list: Employee[]};
    constructor(props: EmployeeList) {
        super(props);
        this.state = {
            searchTerm: "",
            list: props.list
        };
    }

    handleChange = (event) => {
        this.setState({ searchTerm: event.target.value });
        this.filterItems();
    };

    filterItems = () => {
        this.state.list.filter((item) =>
            item.firstName.toLowerCase().includes(this.state.searchTerm.toLowerCase())
        );
    }


    render() {
        return (
            <Form>
                <Form.Group>
                    <Form.Control
                        type="text"
                        className=""
                        placeholder="Search"
                        value={this.state.searchTerm}
                        onChange={this.handleChange}
                    />
                </Form.Group>
            </Form>
        );
    }
}
