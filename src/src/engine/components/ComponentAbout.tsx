import { Logger } from "../Logger";
import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";

/* === Images === */
// @ts-ignore
import Logo from "../../deps/images/logo.png";

export class ComponentAbout extends React.Component {
    private logger: Logger = new Logger(`ComponentAddEmployee`, `#20f6a4`, false);
    private isLoggedIn: boolean = false;

    public render(): JSX.Element {
        return (
            <div className=" justify-content-left">
                <Container className="mt-4 mb-4 d-flex justify-content-center"> <h1> TaskMaster </h1> </Container>
                <Container className="mt-6 mb-4 d-flex justify-content-center"><img
                    className="me-3"
                    src={Logo}
                    alt="Logo TaskMaster"
                    width={200}
                    height={240}
                /></Container>
                <Container className="justify-content-left mt-4 mb-4">
                    <div className="me-4 mt-6 d-block  mx-auto">
                        <h2 className="text-left"> Auteurs</h2>
                        <p className="text-left">David Lawton - Programmeur </p>
                        <p className="text-left">Romin Martignat - Programmeur</p>
                        <p className="text-left">Félix-Antoine Belleau - Programmeur</p>
                        <p className="text-left">William Blanchet Lafernière - Programmeur</p>
                    </div>
                </Container>
            </div>
        );
    }
}