import React from "react";
import {Form} from "react-bootstrap";
import {SearchParams} from "../types/SearchParams";
import {Filter} from "../utils/Filter";

export class ComponentSearchBar<T> extends React.Component<SearchParams<T>> {
    constructor(props: SearchParams<T>) {
        super(props);
    }

    private handleSearchChange(event): void {
        this.filterList(event.target.value);
    }

    private filterList(searchTerm: string): void {
        let filteredList: T[] = [];
        if (searchTerm !== null && searchTerm) {
            filteredList = Filter.filter<T>(this.props.list, searchTerm);

            this.props.filterList(filteredList);
        } else {
            this.props.filterList(this.props.list);
        }
    }

    public render(): JSX.Element {
        return (<Form.Group>
                <Form.Control
                    type="text"
                    placeholder="Search"
                    onChange={this.handleSearchChange.bind(this)}
                />
        </Form.Group>);
    }
}
