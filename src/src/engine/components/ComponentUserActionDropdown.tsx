import React from "react";

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

export class ComponentUserActionDropdown extends React.Component<unknown, unknown> {
    constructor(props) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <DropdownButton
                as={ButtonGroup}
                key={'primary'}
                id={`dropdown-variants-primary`}
                variant={'primary'}
                title={'Paramètres'}
            >
                <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                <Dropdown.Item eventKey="3" active>
                    Active Item
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
            </DropdownButton>
        );
    }


}
