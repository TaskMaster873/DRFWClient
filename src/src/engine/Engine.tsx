import { Logger } from "./Logger";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import '../deps/css/bootstrap.min.css';
import '../deps/css/Engine.css';

/* === Images === */
// @ts-ignore 
//import * as Logo from '../deps/images/logo_color.png';

/* === External Icons === */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt, faCode, faEnvelope, faCube, faCodeBranch, faFilter } from '@fortawesome/free-solid-svg-icons';

import { Index } from "./pages/index";
import { About } from "./pages/about";

import { ComponentExample } from "./components/homepage/ComponentExample";
import { Login } from "./pages/Login";

export class Engine extends React.Component {
	private logger: Logger = new Logger(`Engine`, `#20f6a4`);

	public render() : JSX.Element {
		this.logger.log(`Running rendering engine...`);
		let pageJSX = <this.Navigation />;

		return pageJSX
	}

	//<img src={Logo.default} alt="FunLogo"/>
	private Navigation() : JSX.Element {
		return <div id="rs_home">
			<Router>
				<div id="rs_header">
					<div className="container-fluid">
						<div className="row d-flex align-items-center">
							<div className="col">

							</div>
							<div className="col-auto">
							<nav id="rs_main_menu">
								<ul>
									<li>
										<Link to="/">Home</Link>
									</li>
									<li>
										<Link to="/about">About</Link>
									</li>
									<li>
										<Link to="/test">Users</Link>
									</li>
									<li>
										<Link to="/test">Login</Link>
									</li>
								</ul>
							</nav>
						</div>
					</div>
				</div>
			</div>
			<Routes>
				<Route path="/" element={<Index/>} />
					<Route path="/about" element={<About/>} />
					<Route path="/test" element={<ComponentExample/>} />
					<Route path="/login" element={<Login/>} />
				</Routes>
			</Router>
		</div>;
	}
}