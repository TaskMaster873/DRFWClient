import React from "react";
import Container from "react-bootstrap/Container";
import Logo from "../../deps/images/logo.png";

export class ComponentAbout extends React.Component {
    public render(): JSX.Element {
        return (
            <div className=" justify-content-left">
                <Container className="mt-4 mb-4 d-flex justify-content-center"><h1>TaskMaster</h1></Container>
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
                        <p className="text-left">David Lawton - Horaire, Disponibilités</p>
                        <p className="text-left">Romin Martignat - Calendrier, Disponibilités</p>
                        <p className="text-left">Félix-Antoine Belleau - Employés, Horaire</p>
                        <p className="text-left">William Blanchet Lafrenière - Départements, Employés</p>
                    </div>
                </Container>
            </div>
        );
    }
}
