import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";

export class ComponentPopupSchedule extends React.Component {

	public state: {
		isShowed?: boolean,
		nameOfEvent: string
	};

	constructor(props) {
		super(props);
		this.state = {
			isShowed: false,
			nameOfEvent: "",

		};
		this.onChange = this.onChange.bind(this);
	}

	onChange = () => {
		if (this.state.isShowed === false) {
			let show = true;
			this.setState({ isShowed: show });
			console.log(this.state.isShowed);
		} else {
			this.setState({ isShowed: false });
			console.log(this.state.isShowed);
		}


	};

	public render(): JSX.Element {
		const show = this.state;
		return (
			<>
				<Button variant="primary" onClick={this.onChange} >
					Si vous voyez le bouton, il ne fonctionne pas
				</Button>

				<Modal show={this.state.isShowed} >
					<Modal.Header closeButton onClick={this.onChange}>
						<Modal.Title>Ajouter un corps de travail</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
								<Form.Label>Nom du corps de travail </Form.Label>
								<Form.Control
									type="text"
									placeholder="corps de travail"
									autoFocus />
							</Form.Group>
							<Form.Group
								className="mb-3"
								controlId="exampleForm.ControlTextarea1"
							>
								<Form.Label>input que je ne sais pas si on en aura besoin</Form.Label>
								<Form.Control
									type="text"
									placeholder=""
									autoFocus />
							</Form.Group>
							<Form.Group className="mb-3" controlId="exampleColorInput">
								<Form.Label >Color picker</Form.Label>
							<Form.Control
								type="color"
								defaultValue="#563d7c"
								title="Choose your color"
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={this.onChange} >
						Close
					</Button>
					<Button variant="primary" onClick={this.onChange}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
			</>
		);
	}
}
/*<Button variant="primary" onClick={handleShow}>
					Launch demo modal
				</Button>

				<Modal show={show} onHide={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Modal heading</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
								<Form.Label>Email address</Form.Label>
								<Form.Control
									type="email"
									placeholder="name@example.com"
									autoFocus />
							</Form.Group>
							<Form.Group
								className="mb-3"
								controlId="exampleForm.ControlTextarea1"
							>
								<Form.Label>Example textarea</Form.Label>
								<Form.Control as="textarea" rows={3} />
							</Form.Group>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
						<Button variant="primary" onClick={handleClose}>
							Save Changes
						</Button>
					</Modal.Footer>
				</Modal>*/ 