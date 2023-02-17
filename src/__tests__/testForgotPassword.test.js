import "@testing-library/react/dist/fire-event";
import "@testing-library/jest-dom";
import {fireEvent, render} from "@testing-library/react";
import {FormErrorType} from "../src/engine/messages/FormMessages";
import {testConstants} from "../Constants/testConstants";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from "react-router-dom";
import {ForgotPassword} from "../src/engine/pages/forgotPassword";
import {API} from "../src/engine/api/APIManager";

let user;
beforeEach(async () => {
    user = userEvent.setup();
    render(<MemoryRouter><ForgotPassword/></MemoryRouter>);
});

test("should render form inputs", async () => {
    const {inputEmail, form} = getFields();

    expect(form).not.toBeNull();
    expect(inputEmail).not.toBeNull();
    expect(inputEmail).toHaveAttribute("type", "email");
});

describe("Forgot password validation", () => {
    test("Empty email should show error", async () => {
        const {inputEmail, form} = getFields();

        fireEvent.submit(form);

        expect(inputEmail.value).toBe("");
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });

    test("Invalid email should show error", async () => {
        const {inputEmail, form} = getFields();

        await user.type(inputEmail, testConstants.invalidEmail);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.invalidEmail);
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });
});

test("Valid email should submit form", async () => {
    API.sendResetPassword = jest.fn();
    const {inputEmail, form} = getFields();

    await user.type(inputEmail, testConstants.validEmail);

    fireEvent.submit(form);

    expect(inputEmail.value).toBe(testConstants.validEmail);
    expect(form.classList.contains("was-validated")).toBeTruthy();
    expect(form.dataset.error).toBe(FormErrorType.NO_ERROR);
    expect(API.sendResetPassword).toBeCalled();
});

function getFields() {
    const form = document.querySelector("form");
    const inputEmail = document.getElementById("email");
    return {form, inputEmail};
}
