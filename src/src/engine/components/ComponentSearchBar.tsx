import React from "react";
import {Col, Form} from "react-bootstrap";
import {Employee} from "../types/Employee";

export class ComponentSearchBar extends React.Component<{ list: any, filterList: (filteredList: any) => void }> {
    public state: { list: any };

    constructor(props: { list: any, filterList: (filteredList: Employee[]) => void }) {
        super(props);
        this.state = {
            list: props.list
        };
    }

    handleSearchChange = (event) => {
        this.filterList(event.target.value);
    };

    filterList = (searchTerm) => {
        let filteredList: any = [];
        if (searchTerm != "") {
            filteredList = this.state.list.filter((item) => item.firstName.toLowerCase().includes(searchTerm.toLowerCase()));
            this.props.filterList(filteredList);
        } else {
            this.props.filterList(this.state.list);
        }
    }


    render() {
        return (<Form.Group>
            <Col xs={6}>
                <Form.Select
                    onChange={this.handleSearchChange}>
                    <option value="email">Par Adresse courriel</option>
                    <option value="firstName">Par Prénom</option>
                    <option value="name">Par Nom</option>
                    <option>Par Nom</option>
                </Form.Select>
            </Col>
            <Col xs={6}>
                <Form.Control
                    type="text"
                    placeholder="Search"
                    onChange={this.handleSearchChange}
                />
            </Col>
        </Form.Group>);
    }
}
