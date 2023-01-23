[//]: # (TODO : Remplacer le titre de ce document par le nom de votre application. Attention à conserver les sauts de ligne!)
[//]: # (TODO : Remplacer le logo par le logo de votre application. Attention à conserver les sauts de ligne!)
<div align="center">

![Projet Synthèse](.docs/Logo.svg)

# Projet Synthèse

</div>

[//]: # (TODO : Remplacer ce texte par une courte description de votre projet.)

Projet de l'épreuve synthèse de programme des Techniques de l'informatique du Cégep de Sainte-Foy. Ce projet fut réalisé avec
les meilleures pratiques de l'industrie, incluant les méthodes Agiles et de l'intégration continue avec GitLab CI.

[//]: # (TODO : Remplacez cette image par une capture d'écran de votre application.)

<div align="center">

![Aperçu du Projet Synthèse](.docs/Preview.png)

</div>

## Installation

[//]: # (TODO : Remplacez le nom de l'exécutable par celui dans ".gitlab-ci.yml". Voir la variable BUILD_NAME.)

Téléchargez la dernière version [stable de l'application][Stable Download]. Décompressez l'archive dans un dossier 
et exécutez l'installateur `app.msi`. Notez que vous aurez à naviguer au travers de quelques sous-dossiers. Sous Windows,
vous aurez aussi un avertissement de sécurité que vous pouvez ignorer en cliquant sur le lien *Informations 
complémentaires* de la fenêtre.

## Démarrage rapide

Ces instructions vous permettront d'obtenir une copie opérationnelle du projet sur votre machine à des fins de 
développement.

### Prérequis

[//]: # (TODO : Ajouter tout autre logiciel nécessaire au développement.)
[//]: # (TODO : Notez que les hyperliens sont décrits à la fin de ce document.)

* [Git] - Système de contrôle de version. Utilisez la dernière version.
* [NodeJs] - Environnement JavaScript.
* [IntelliJ Idea] - IDE. Vous pouvez utiliser également n'importe quel autre IDE: assurez-vous simplement 
  qu'il supporte les projets Unity.

### Compiler une version de développement

[//]: # (TODO : Adaptez ces instructions à votre situation.)

Clonez le dépôt. Téléchargez les dépendances *NodeJs* via la commande `npm install`. Ensuite, démarrez le programme
en mode débogage via la commande `npm run dev`.

### Compiler une version stable

Suivez les instructions pour compiler une version de développement. Ensuite, utilisez la commande `npm run build` pour créer 
un exécutable dans le dossier `/target/release/`. Vous y trouverez un fichier `app` (ou `app.exe` sur Windows).


## Tester le projet

Vous êtes fortement encouragés à tester [la dernière version][Develop Download] de l'applicaiton. Si vous 
rencontrez un bogue, vous êtes priés de le [signaler][Submit Bug] et de fournir une explication détaillée du problème 
avec les étapes pour le reproduire. Les captures d'écran et les vidéos sont les bienvenues.

## Contribuer au projet

Veuillez lire [CONTRIBUTING.md](CONTRIBUTING.md) pour plus de détails sur notre code de conduite.

## Auteurs

[//]: # (TODO : Ajoutez vous noms ici ainsi que le nom de tout artiste ayant participé au projet avec un lien vers son portfolio.)
[//]: # (       Inscrivez aussi, en détail, ce sur quoi chaque membre de l'équipe a principalement travaillé.)
[//]: # (       Vous n'êtes pas obligé d'inclure mon nom dans les auteurs du projet. C'est pour vous montrer comment faire.)

* **Prénom Nom** - *Programmeur*
* **Prénom Nom** - *Programmeur*
* **Prénom Nom** - *Programmeur*
* **Prénom Nom** - *Programmeur*
* **Prénom Nom** - *Concepteur sonore*
* **Prénom Nom** - *Artiste 2D et Artiste UI*
* **Benjamin Lemelin** - *Professeur en informatique*

## Changelog

Consultez le fichier [CHANGELOG.md](CHANGELOG.md) pour la liste des changements de chaque version.

## License

[//]: # (TODO : Si vous désirez que votre projet soit Open-Source (ce qui est PAS une obligation), adaptez cette section.)

Ce projet est sous license GNU GPLv3. Consultez [LICENSE.md](LICENSE.md) pour les détails.

## Remerciements

[//]: # (TODO : Remercier toute personne ou groupe ayant contribué au projet, mais qui n'est pas un auteur.)

* [GameCI] - Images Docker d'intégration continue pour *Unity*.

[//]: # (Hyperliens)
[Git]: https://git-scm.com/downloads
[NodeJs]: https://nodejs.org/en/
[IntelliJ Idea]: https://www.jetbrains.com/idea/
[GitLab CI]: https://docs.gitlab.com/ee/ci/

[//]: # (TODO : Modifiez ces hyperlien pour qu'ils ciblent votre projet à la place. Conservez le restant de l'URL.)
[//]: # (       Ici, vous devez remplacer "https://gitlab.com/csfpwmjv/projet-synthese/starter-game" par le votre.)
[Submit Bug]: https://gitlab.com/csfpwmjv/projet-synthese/starter-game/issues/new?issuable_template=Bug
[Stable Download]: https://gitlab.com/csfpwmjv/projet-synthese/starter-game/-/jobs/artifacts/master/download?job=build
[Develop Download]: https://gitlab.com/csfpwmjv/projet-synthese/starter-game/-/jobs/artifacts/develop/download?job=build