import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import { NotificationManager } from 'react-notifications';
import { API } from "../api/APIManager";
import { errors, successes } from "../messages/FormMessages";
import Logo from "../../deps/images/logo.png";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock, faClipboard, faBuilding } from '@fortawesome/free-solid-svg-icons';
import {RoutesPath} from "../RoutesPath";
import { ComponentNavItem as NavItem } from "./ComponentNavItem";

interface NavigationBarState {
    showCreateSchedule: boolean;
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
export class NavigationBar extends React.Component<unknown, NavigationBarState> {
    private _isMountedAPI: boolean = false;

    public state: NavigationBarState = {
        showCreateSchedule: false,
    };

    constructor(props) {
        super(props);

        API.subscribeToEvent(this.onAPIEvent.bind(this));
    }

    public componentDidMount() : void{
        this._isMountedAPI = true;
    }

    public componentWillUnmount() : void {
        this._isMountedAPI = false;
    }

    /**
     * This function returns the links to the admin commands if the user is an admin
     * @returns {JSX.Element[]} The links to the admin commands
     * @private
     * @category Components
     * @subcategory Navigation
     * @hideconstructor
     */
    private async onAPIEvent(): Promise<void> {
        return new Promise((resolve) => {
            if (this._isMountedAPI) {
                this.setState({
                    showCreateSchedule: true
                }, () => {
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    public render(): JSX.Element {
        return (
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{ fontSize: 15 }}>
                <Container fluid={true}>
                    <LinkContainer to="/">
                        <Navbar.Brand>
                            <img
                                className="me-3"
                                src={Logo as any}
                                alt="Logo TaskMaster"
                                width={50}
                                height={60}
                            />

                            TaskMaster
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav activeKey="">
                            {this.adminCommandLinks()}

                            <NavItem icon={<FontAwesomeIcon icon={faCalendar} />} link={RoutesPath.SCHEDULE} label="Mon horaire" description="Gérez votre emploi du temps" />
                            <NavItem icon={<FontAwesomeIcon icon={faClock} />} link={RoutesPath.AVAILABILITIES} label="Mes disponibilités" description="Gérez vos disponibilités" />
                            <NavItem icon={<FontAwesomeIcon icon={faClipboard} />} link={RoutesPath.DEPARTMENTS} label="Départements" description="Voir tous les départements" />
                            <NavItem icon={<FontAwesomeIcon icon={faBuilding} />} link={RoutesPath.ABOUT} label="À propos" description="À propos de TaskMaster" />
                        </Nav>

                        <Nav className="ms-auto">
                            {this.loginButton()}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
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
                <LinkContainer to={RoutesPath.INDEX}>
                    <Nav.Link id="logoutLink" onClick={this.#logout}>Se déconnecter</Nav.Link>
                </LinkContainer>
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
     * This function returns the links to the admin commands if the user is an admin
     * @returns {JSX.Element[]} The links to the admin commands
     * @category Components
     * @subcategory Navigation
     * @hideconstructor
     * @see adminCommandLinks
     * @see NavigationBarState
     * @private
     */
    private adminCommandLinks(): JSX.Element | undefined {
        if (this.state.showCreateSchedule) {
            return (
                <LinkContainer to={RoutesPath.CREATE_SCHEDULE}>
                    <Nav.Link id="create-schedule">Création d'employés</Nav.Link>
                </LinkContainer>
            );
        }
    }

    /**
     * This function logs out the user
     * @returns {Promise<void>} A promise that resolves when the logout is complete
     * @category Components
     * @subcategory Navigation
     * @hideconstructor
     * @see adminCommandLinks
     * @see NavigationBarState
     * @see API
     * @private
     */
    readonly #logout = async (): Promise<void> => {
        let error = await API.logout();
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.LOGOUT_SUCCESS);
        } else {
            NotificationManager.error(errors.ERROR_LOGOUT, error);
        }
    }
}
