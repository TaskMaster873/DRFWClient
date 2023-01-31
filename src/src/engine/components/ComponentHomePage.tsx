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
                <Container className="text-left mt-4 mb-4">TaskMaster est un gestionnaire d'horaire pour entreprise. En tant qu'application web, TaskMaster est accessible partout et permet à une entreprise de mieux gérer ses effectifs.</Container>
                <Container className="justify-content-left mt-4 mb-4">
                    <div className="me-4 mt-6 d-block  mx-auto">
                        <h2 className="text-left"> Auteurs</h2>
                        <p className="text-left">David Lawton - Programmeur </p>
                        <p className="text-left">Romin Martignat - Programmeur</p>
                        <p className="text-left">Félix-Antoine Belleau - Programmeur</p>
                        <p className="text-left">William Blanchet Lafernière - Programmeur</p>
                        <p className="text-left">Benjamin Lemelin - Professeur en informatique</p>
                    </div>
                </Container>
                <div className="me-4 mt-4 d-block text-left mx-auto">
                    <LinkContainer to="/login">
                        <Button
                            data-testid="submitLogin"
                            className="mt-4"
                            variant="primary"
                            size="lg"
                            type="submit"
                            value="Submit"
                        >
                            Connexion
                        </Button>
                    </LinkContainer>
                </div>
            </div>
        );
    }

    /*
    
    <div align="left">
<img src="docs/logo.png" alt="TaskMaster Logo" width="200"/>

# TaskMaster Client

</div>

TaskMaster est un gestionnaire d'horaire pour entreprise. En tant qu'application web, TaskMaster est accessible partout et permet à une entreprise de mieux gérer ses effectifs.

[//]: # (TODO : Remplacez cette image par une capture d'écran de votre application.)

<div align="left">

![Aperçu du Projet Synthèse](docs/Preview.png)

</div>

## Installation

Téléchargez la dernière version [stable de l'application][Releases]. Décompressez l'archive dans un dossier 
et mettez le en ligne sur un serveur web.

## Démarrage rapide

Ces instructions vous permettront d'obtenir une copie opérationnelle du projet sur votre machine à des fins de 
développement.

### Prérequis

* [Git] - Système de contrôle de version. Utilisez la dernière version.
* [NodeJs] - Environnement JavaScript.
* [IntelliJ Idea] - IDE. Vous pouvez utiliser également n'importe quel autre IDE.

### Compiler une version de développement

Clonez le dépôt. Téléchargez les dépendances *NodeJs* via la commande `npm i`. Ensuite, démarrez le programme
en mode débogage via la commande `npm run dev`.

### Compiler une version stable

Suivez les instructions pour compiler une version de développement. Ensuite, utilisez la commande `npm run build` pour créer une version prête à deployer dans le dossier `/build/`.


## Tester le projet

Vous êtes fortement encouragés à tester [la dernière version][Releases] de l'application. Si vous 
rencontrez un bogue, vous êtes priés de le [signaler][Submit Bug] et de fournir une explication détaillée du problème 
avec les étapes pour le reproduire. Les captures d'écran et les vidéos sont les bienvenues.

## Auteurs

* **David Lawton** - *Programmeur(Front-End)*
* **Romin Martignat** - *Programmeur(Front-End)*
* **Félix-Antoine Belleau** - *Programmeur(Back-End)*
* **William Blanchet Lafernière** - *Programmeur(Back-End)*
* **Benjamin Lemelin** - *Professeur en informatique*

## Changelog

Consultez la description de [la dernière version][Releases] de l'application.

## License

X

## Remerciements

X

[//]: # (Hyperliens)
[Git]: https://git-scm.com/downloads
[NodeJs]: https://nodejs.org/en/
[IntelliJ Idea]: https://www.jetbrains.com/idea/

[Submit Bug]: https://github.com/BlobMaster41/DRFWClient/issues/new
[Releases]: https://github.com/BlobMaster41/DRFWClient/releases
    
    */
    /*  private loginButton() {
          if (this.isLoggedIn) {
              return <Nav.Link onClick={this.logOut}>Se déconnecter</Nav.Link>;
          } else {
              return (
                  <LinkContainer to="/login">
                      <Nav.Link id="loginLink">Connexion</Nav.Link>
                  </LinkContainer>
              );
          }
      }*/
}