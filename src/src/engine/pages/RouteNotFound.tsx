import React from "react";
import {RoutesPath} from "../RoutesPath";
import {Link} from "react-router-dom";

export class RouteNotFound extends React.Component<unknown, unknown> {
    constructor(props: unknown) {
        super(props);
    }

    public render() : JSX.Element {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-90">
                <div className="text-center">
                    <h1 className="display-1 fw-bold">404</h1>
                    <p className="fs-3"><span className="text-danger">Opps!</span> La page n'a pas été trouvé.</p>
                    <p className="lead">
                        La page que vous recherchez n'existe pas ou a été déplacée.
                    </p>

                    <Link className="d-block" to={RoutesPath.INDEX}>
                        <button className="btn btn-primary">Retourner à l'accueil</button>
                    </Link>
                </div>
            </div>
        );
    }
}
