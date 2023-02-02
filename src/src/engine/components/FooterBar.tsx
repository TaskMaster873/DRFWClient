import React from "react";
import Nav from "react-bootstrap/Nav";

import { LinkContainer } from "react-router-bootstrap";

export class FooterBar extends React.Component {
    private isLoggedIn: boolean = false;

    /**
     * <Navbar variant="dark" fixed="bottom">
     *           <Container  className="d-flex flex-wrap justify-content-between align-items-center">
     *           <LinkContainer to="/">
     *               <Navbar.Brand>
     *                 <img
     *                   className="ms-2"
     *                   src={Logo}
     *                   alt="Logo TaskMaster"
     *                   width={25}
     *                   height={30}
     *                 />
     *               </Navbar.Brand>
     *             </LinkContainer>
     *             <Nav className="px-2 fs-6">
     *               <Navbar.Text>Équipe DRFW</Navbar.Text>
     *             </Nav>
     *             <Nav className="px-2 fs-6 ">
     *               <LinkContainer to="/login">
     *                 <Nav.Link>{this.loginButton()}</Nav.Link>
     *               </LinkContainer>
     *             </Nav>
     *             <Nav className="px-2 fs-6">
     *               <LinkContainer to="/schedule">
     *                 <Nav.Link>Horaire</Nav.Link>
     *               </LinkContainer>
     *             </Nav>
     *             <Nav className="px-2 fs-6">
     *               <LinkContainer to="/about">
     *                 <Nav.Link>À propos</Nav.Link>
     *               </LinkContainer>
     *             </Nav>
     *           </Container>
     *         </Navbar>
     */
    public render(): JSX.Element {
        return (
            <div>
                <div className="pt-5 pb-4 "></div>

            </div>
        );
    }

    /**
     *
     * @returns se déconnecter si la personne est connectée
     * */

    private loginButton() {
        if (this.isLoggedIn) {
            return <Nav.Link onClick={this.logOut}>Se déconnecter</Nav.Link>;
        } else {
            return (
                <LinkContainer to="/login">
                    <Nav.Link id="loginLink">Connexion</Nav.Link>
                </LinkContainer>
            );
        }
    }

    /**
     * Je ne sais pas si il faudrait le garder
     */
    private logOut() {

    }
}

