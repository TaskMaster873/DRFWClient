import React from "react";
import {Form} from "react-bootstrap";
import {Employee} from "../types/Employee";

export class ComponentSearchBar extends React.Component<{list: Employee[], filterList: (filteredList: Employee[]) => void}> {
    public state: { searchTerm: string, list: Employee[]};
    constructor(props: {list: Employee[], filterList: (filteredList: Employee[]) => void}) {
        super(props);
        this.state = {
            searchTerm: "",
            list: props.list
        };
    }

    handleChange = (event) => {
        this.setState({ searchTerm: event.target.value });
        this.filterList();
    };

    filterList = () => {
        const filteredList = this.state.list.filter((item) =>
            item.firstName.toLowerCase().includes(this.state.searchTerm.toLowerCase())
        );
        this.props.filterList(filteredList);
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
