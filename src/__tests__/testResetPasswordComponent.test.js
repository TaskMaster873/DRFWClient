import "@testing-library/react/dist/fire-event";
import "@testing-library/jest-dom";
import * as router from 'react-router'
import {fireEvent, render} from "@testing-library/react";
import {FormErrorType} from "../src/engine/messages/FormMessages";
import testConstants from "../Constants/testConstants";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from "react-router-dom";
import { ComponentResetPassword } from '../src/engine/components/ComponentResetPassword';

jest.mock("../src/engine/api/APIManager");
const {API} = require("../src/engine/api/APIManager");

const navigate = jest.fn()

let user;
beforeEach(async () => {
    user = userEvent.setup();
    //Mock navigate
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
    
    render(<MemoryRouter><ComponentResetPassword actionCode="" email={testConstants.validEmail}/></MemoryRouter>);
});

test("should render form inputs", async () => {
    const {inputPassword, form} = getFields();
    const emailDiv = document.getElementById("email");

    expect(form).not.toBeNull();
    expect(inputPassword).not.toBeNull();
    expect(emailDiv.innerHTML).toMatch(new RegExp(testConstants.validEmail, "g"));
    expect(inputPassword).toHaveAttribute("type", "password");
});

describe("Reset password validation", () => {
    test("Empty password should show error", async () => {
        const {inputPassword, form} = getFields();

        fireEvent.submit(form);

        expect(inputPassword.value).toBe("");
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });

    test("Invalid password should show error", async () => {
        const {inputPassword, form} = getFields();

        await user.type(inputPassword, testConstants.invalidPassword);

        fireEvent.submit(form);

        expect(inputPassword.value).toBe(testConstants.invalidPassword);
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });
});

test("Valid password should submit form", async () => {
    API.applyResetPassword = async (actionCode, newPassword) => Promise.resolve();
    const {inputPassword, form} = getFields();

    await user.type(inputPassword, testConstants.validPassword);

    await fireEvent.submit(form);

    expect(inputPassword.value).toBe(testConstants.validPassword);
    expect(form.classList.contains("was-validated")).toBeTruthy();
    expect(form.dataset.error).toBe(FormErrorType.NO_ERROR);
});

function getFields() {
    const form = document.querySelector("form");
    const inputPassword = document.getElementById("newPassword");
    return {form, inputPassword};
}
