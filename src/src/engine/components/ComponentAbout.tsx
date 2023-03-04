import React from "react";
import Container from "react-bootstrap/Container";
import Logo from "../../deps/images/logo.png";

export class ComponentAbout extends React.Component {
    public render(): JSX.Element {
        return (
            <div className=" justify-content-left">
                <Container className="mt-4 mb-4 d-flex justify-content-center"><h1> TaskMaster </h1></Container>
                <Container className="mt-6 mb-4 d-flex justify-content-center"><img
                    className="me-3"
                    src={Logo as any}
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
