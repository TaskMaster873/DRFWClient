import "@testing-library/react/dist/fire-event";
import "@testing-library/jest-dom";
import {fireEvent, render} from "@testing-library/react";
import {FormErrorType} from "../src/engine/messages/FormMessages";
import testConstants from "../Constants/testConstants";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from "react-router-dom";
import {Login} from "../src/engine/pages/login";
import {API} from "../src/engine/api/APIManager";

let user;
beforeEach(async () => {
    user = userEvent.setup();
    render(<MemoryRouter><Login/></MemoryRouter>);
});

test("should render form inputs", async () => {
    const {inputPassword, form, inputEmail} = getFields();

    expect(form).not.toBeNull();
    expect(inputEmail).not.toBeNull();
    expect(inputPassword).not.toBeNull();
    expect(inputEmail).toHaveAttribute("type", "email");
    expect(inputPassword).toHaveAttribute("type", "password");
});

describe("Empty Fields login validation", () => {
    test("Empty employee number should show error", async () => {
        const {inputPassword, form, inputEmail} = getFields();

        await user.type(inputPassword, testConstants.validPassword);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe("");
        expect(inputPassword.value).toBe(testConstants.validPassword);
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });

    test("Empty password should show error", async () => {
        const {inputPassword, form, inputEmail} = getFields();

        await user.type(inputEmail, testConstants.validEmail);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.validEmail);
        expect(inputPassword.value).toBe("");
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });
});

test("Valid email and password should submit form", async () => {
    API.loginWithPassword = jest.fn();
    const {inputPassword, form, inputEmail} = getFields();

    await user.type(inputEmail, testConstants.validEmail);
    await user.type(inputPassword, testConstants.validPassword);

    fireEvent.submit(form);

    expect(inputEmail.value).toBe(testConstants.validEmail);
    expect(inputPassword.value).toBe(testConstants.validPassword);
    expect(form.classList.contains("was-validated")).toBeTruthy();
    expect(form.dataset.error).toBe(FormErrorType.NO_ERROR);
    expect(API.loginWithPassword).toBeCalled();
});

function getFields() {
    const form = document.querySelector("form");
    const inputEmail = document.getElementById("emailLogin");
    const inputPassword = document.getElementById("passwordLogin");
    return {inputPassword, form, inputEmail};
}
