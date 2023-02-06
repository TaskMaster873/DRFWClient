import "@testing-library/react/dist/fire-event";
import "@testing-library/jest-dom";
import {fireEvent, render} from "@testing-library/react";
import {FormErrorType} from "../src/engine/errors/FormErrorType";
import testConstants from "../Constants/testConstants";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from "react-router-dom";
import {Login} from "../src/engine/pages/login";
import {Config} from "../src/engine/config/Config";


let user;
beforeEach(async () => {
    user = userEvent.setup();
    render(<MemoryRouter><Login/></MemoryRouter>);
});

test("should render form inputs", async () => {
    const {inputPassword, form, inputId} = getFields();

    expect(form).not.toBeNull();
    expect(inputId).not.toBeNull();
    expect(inputPassword).not.toBeNull();
    expect(inputId).toHaveAttribute("type", "number");
    expect(inputPassword).toHaveAttribute("type", "password");
});

describe("Empty Fields login validation", () => {
    test("Empty employee number should show error", async () => {
        const {inputPassword, form, inputId} = getFields();

        await user.type(inputPassword, testConstants.validPassword);

        fireEvent.submit(form);

        expect(inputId.value).toBe("");
        expect(inputPassword.value).toBe(testConstants.validPassword);
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });

    test("Empty password should show error", async () => {
        const {inputPassword, form, inputId} = getFields();

        await user.type(inputId, testConstants.validIdEmployee);

        fireEvent.submit(form);

        expect(inputId.value).toBe(testConstants.validIdEmployee);
        expect(inputPassword.value).toBe("");
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });
});

test("Valid employee number and password should submit form", async () => {
    Config.loginWithPassword = jest.fn();
    const {inputPassword, form, inputId} = getFields();

    await user.type(inputId, testConstants.validIdEmployee);
    await user.type(inputPassword, testConstants.validPassword);

    fireEvent.submit(form);

    expect(Config.loginWithPassword).toBeCalled();
    expect(inputId.value).toBe(testConstants.validIdEmployee);
    expect(inputPassword.value).toBe(testConstants.validPassword);
    expect(form.classList.contains("was-validated")).toBeTruthy();
    expect(form.dataset.error).toBe(FormErrorType.NO_ERROR);
});

function getFields() {
    const form = document.querySelector("form");
    const inputId = document.getElementById("noLogin");
    const inputPassword = document.getElementById("passwordLogin");
    return {inputPassword, form, inputId};
}
