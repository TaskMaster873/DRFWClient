import "@testing-library/react/dist/fire-event";
import "@testing-library/jest-dom";
import {render} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from "react-router-dom";
import { NavigationBar } from "../src/engine/components/NavigationBar";

jest.mock("../src/engine/api/APIManager");
const {API} = require("../src/engine/api/APIManager");

let user;
beforeEach(async () => {
    user = userEvent.setup();
});

test("should render only login button when logged out", async () => {
    //User is not logged in
    API.isAuth = () => false;
    //Render component
    render(<MemoryRouter><NavigationBar/></MemoryRouter>);
    //Get data
    const {logoutLink, loginLink} = getFields();
    //Assert
    expect(logoutLink).toBeNull();
    expect(loginLink).not.toBeNull();
});

function getFields() {
    const logoutLink = document.getElementById("logoutLink");
    const loginLink = document.getElementById("loginLink");
    return {logoutLink, loginLink};
}
