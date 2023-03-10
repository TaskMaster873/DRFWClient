import React from "react";

import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import {RoutesPath} from "../RoutesPath";
import {API} from "../api/APIManager";
import {NotificationManager} from "../api/NotificationManager";
import {errors, successes} from "../messages/FormMessages";
import {Nav} from "react-bootstrap";
import {Navigate} from "react-router-dom";
import {IoSettingsSharp} from "react-icons/io5";

interface ComponentUserActionDropdownState {
    redirectTo: string;
}

export class ComponentUserActionDropdown extends React.Component<unknown, ComponentUserActionDropdownState> {
    public state: ComponentUserActionDropdownState = {
        redirectTo: ""
    };

    constructor(props) {
        super(props);
    }

    public componentDidUpdate(prevProps: Readonly<unknown>, prevState: Readonly<ComponentUserActionDropdownState>, snapshot?: any) {
        if (this.state.redirectTo) {
            this.setState({
                redirectTo: ""
            });
        }
    }

    public render(): JSX.Element {
        if (this.state.redirectTo) {
            return (
                <Navigate to={this.state.redirectTo}/>
            );
        } else {
            return (
                <DropdownButton
                    drop={"down-centered"}
                    as={ButtonGroup}
                    key={"primary"}
                    id={`dropdown-variants-primary`}
                    variant={"dark"}
                    title={<IoSettingsSharp size={25}/>}
                >
                    <Dropdown.Item eventKey="1">
                        <Nav id="logoutLink" className={"dropDownMenuText"} onClick={this.#logout}>Se
                            déconnecter</Nav>
                    </Dropdown.Item>
                    <Dropdown.Divider/>
                    <Dropdown.Item eventKey="2">
                        <Nav id="changePassword" className={"dropDownMenuText"} onClick={this.#changePassword}>Changer
                            mon mot de passe</Nav>
                    </Dropdown.Item>
                </DropdownButton>
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
        if (API.isAuth()) {
            let error = await API.logout();
            if (!error) {
                NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.LOGOUT_SUCCESS);
            } else {
                NotificationManager.error(errors.ERROR_LOGOUT, error);
            }

            this.setState({
                redirectTo: RoutesPath.INDEX
            });
        }
    };

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
    readonly #changePassword = async (): Promise<void> => {
        if (API.isAuth()) {
            this.setState({
                redirectTo: RoutesPath.CHANGE_PASSWORD
            });
        }
    };
}
