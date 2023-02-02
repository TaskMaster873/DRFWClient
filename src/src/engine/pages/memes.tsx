import React from "react";

/* === Images === */
// @ts-ignore
import Icecream from "../../deps/images/bing-chilling.jpg";

/**
 * Cette classe ne sert à rien
 */
export class Memes extends React.Component {
  public componentDidMount() {
    document.title = "Memes - TaskMaster";
  }

  public render(): JSX.Element {
    return (
      <div>
        <h2 className="text-center m-4">Bing Chilling</h2>
        <img className="image-fluid" src={Icecream} alt="Bing Chilling" />
        <iframe
          className="mt-4"
          width="560"
          height="315"
          src="https://www.youtube.com/embed/w53oh5DJ9oQ"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen;"
        ></iframe>
      </div>
    );
  }
}
