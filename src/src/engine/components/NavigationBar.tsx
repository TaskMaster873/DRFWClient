import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {LinkContainer} from "react-router-bootstrap";
import {API} from "../api/APIManager";
import Logo from "../../deps/images/logo.png";
import {ComponentUserActionDropdown} from "./ComponentUserActionDropdown";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAddressBook,
    faBuilding,
    faCalendar,
    faCalendarDays,
    faClipboard,
    faClock
} from "@fortawesome/free-solid-svg-icons";
import {RoutesPath} from "../RoutesPath";
import {ComponentNavItem as NavItem} from "./ComponentNavItem";
import {Roles} from "../types/Roles";

interface State {
    toggle: boolean;
}

/**
 * This is the navigation bar component, it is displayed on every page. It shows the links to the different pages and the login button.
 * @returns {JSX.Element}
 * @constructor
 * @category Components
 * @subcategory Navigation
 * @hideconstructor
 * @see NavigationBarState
 */
export class NavigationBar extends React.Component<unknown, State> {
    public state: State = {
        toggle: false
    };

    constructor(props) {
        super(props);
        API.subscribeToEvent(this.toggle.bind(this));
    }

    public render(): JSX.Element {
        return (
            <Navbar collapseOnSelect expand="lg" variant="dark" className={"navbar-element"}>
                <Container fluid={true}>
                    <LinkContainer to="/">
                        <Navbar.Brand>
                            <img
                                className="me-3"
                                src={Logo}
                                alt="Logo TaskMaster"
                                width={50}
                                height={60}
                            />
                            TaskMaster
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        {this.generalLinks()}
                        <Nav className="ms-auto">
                            {this.loginButton()}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }

    private async toggle(): Promise<void> {
        this.setState({toggle: !this.state.toggle});
    }

    /**
     * If the user is logged in, it returns the logout button, otherwise it returns the login button
     * @returns {JSX.Element} The login or logout button
     * @private
     * @category Components
     * @subcategory Navigation
     * @hideconstructor
     * @see loginButton
     */
    private loginButton(): JSX.Element {
        if (API.isAuth()) {
            return (
                <ComponentUserActionDropdown/>
            );
        } else {
            return (
                <LinkContainer to={RoutesPath.LOGIN}>
                    <Nav.Link id="loginLink">Connexion</Nav.Link>
                </LinkContainer>
            );
        }
    }

    /**
     * This function returns the links used to navigate the website
     * @returns {JSX.Element} The navigation links
     * @category Components
     * @subcategory Navigation
     * @hideconstructor
     * @see generalLinks
     * @private
     */
    private generalLinks(): JSX.Element {
        if (API.hasPermission(Roles.MANAGER)) {
            return (
                <Nav activeKey="">
                    <NavItem icon={<FontAwesomeIcon icon={faCalendarDays}/>} link={RoutesPath.CREATE_SCHEDULE}
                             label="Cr??ation d'horaire" description="G??rez les quarts de travail"/>
                    <NavItem icon={<FontAwesomeIcon icon={faClipboard}/>} link={RoutesPath.MANAGE_AVAILABILITIES}
                             label="Gestion des disponibilit??s" description="G??rez les demandes de disponibilit??s"/>
                    <NavItem icon={<FontAwesomeIcon icon={faCalendar}/>} link={RoutesPath.SCHEDULE} label="Mon horaire"
                             description="Consultez vos quarts de travail"/>
                    <NavItem icon={<FontAwesomeIcon icon={faClock}/>} link={RoutesPath.AVAILABILITIES}
                             label="Mes disponibilit??s" description="Modifier vos disponibilit??s"/>
                    <NavItem icon={<FontAwesomeIcon icon={faAddressBook}/>} link={RoutesPath.DEPARTMENTS}
                             label="D??partements" description="Voir tous les d??partements"/>
                    <NavItem icon={<FontAwesomeIcon icon={faBuilding}/>} link={RoutesPath.ABOUT} label="?? propos"
                             description="?? propos de TaskMaster"/>
                </Nav>
            );
        } else if (API.hasPermission(Roles.EMPLOYEE)) {
            return (
                <Nav activeKey="">
                    <NavItem icon={<FontAwesomeIcon icon={faCalendar}/>} link={RoutesPath.SCHEDULE} label="Mon horaire"
                             description="Consultez vos quarts de travail"/>
                    <NavItem icon={<FontAwesomeIcon icon={faClock}/>} link={RoutesPath.AVAILABILITIES}
                             label="Mes disponibilit??s" description="Modifier vos disponibilit??s"/>
                    <NavItem icon={<FontAwesomeIcon icon={faAddressBook}/>} link={RoutesPath.DEPARTMENTS}
                             label="D??partements" description="Voir tous les d??partements"/>
                    <NavItem icon={<FontAwesomeIcon icon={faBuilding}/>} link={RoutesPath.ABOUT} label="?? propos"
                             description="?? propos de TaskMaster"/>
                </Nav>
            );
        } else {
            return (
                <Nav activeKey="">
                    <NavItem icon={<FontAwesomeIcon icon={faBuilding}/>} link={RoutesPath.ABOUT} label="?? propos"
                             description="?? propos de TaskMaster"/>
                </Nav>
            );
        }
    }
}
