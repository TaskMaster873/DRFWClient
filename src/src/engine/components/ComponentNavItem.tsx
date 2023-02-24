import React from "react";

import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";

interface ComponentNavItemProps {
    icon?: JSX.Element;
    label: string;
    description?: string;
    link: string;
}

/**
 * This is the form to add an employee
 * @param props The props of the component
 * @constructor
 * @category Components
 * @subcategory Employee
 * @hideconstructor
 */
export class ComponentNavItem extends React.Component<ComponentNavItemProps, unknown> {
    public props: ComponentNavItemProps;

    constructor(props: ComponentNavItemProps) {
        super(props);
        this.props = props;
    }

    public render(): JSX.Element {
        return (
            <LinkContainer to={this.props.link}>
                <Nav.Link>
                    <div className="navIcon">
                        {this.props.icon}
                    </div>
                    <div className="navItem">
                        <div className="navLabel">
                            {this.props.label}
                        </div>
                        <div className="navDescription">
                            {this.props && this.props.description && true ? this.props.description : ""}
                        </div>
                    </div>
                </Nav.Link>
            </LinkContainer>
        );
    }
}
