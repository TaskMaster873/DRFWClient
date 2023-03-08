import React from "react";
import {ComponentAbout} from "../components/ComponentAbout";
import {ParticlesOpts} from "../types/Particles";
import Particles from "react-particles";
import {Engine} from "tsparticles-engine";
import {loadFull} from "tsparticles";

/**
 * Ceci est la page : à propos de nous
 */
export class About extends React.Component {
    public componentDidMount() {
        document.title = "À propos - TaskMaster";
    }

    public render(): JSX.Element {
        return <div>
            <Particles options={ParticlesOpts} init={this.#customInit}/>
            <ComponentAbout/>;
        </div>;
    }

    readonly #customInit = async (engine: Engine) => {
        await loadFull(engine);
    };
}
