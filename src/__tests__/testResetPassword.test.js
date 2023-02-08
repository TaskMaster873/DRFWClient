import "@testing-library/react/dist/fire-event";
import "@testing-library/jest-dom";
import {fireEvent, render} from "@testing-library/react";
import {FormErrorType} from "../src/engine/messages/FormMessages";
import testConstants from "../Constants/testConstants";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from "react-router-dom";
import {SocketManager} from "../src/engine/networking/WebsocketManager";
import {ResetPassword} from "../src/engine/pages/resetPassword";

let user;
beforeEach(async () => {
    user = userEvent.setup();
    render(<MemoryRouter><ResetPassword/></MemoryRouter>);
});

test("should render form inputs", async () => {
    const {inputEmail, form} = getFields();

    expect(form).not.toBeNull();
    expect(inputEmail).not.toBeNull();
    expect(inputEmail).toHaveAttribute("type", "email");
});

describe("Reset password validation", () => {
    test("Empty old password should show error", async () => {
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

test("Valid email password should submit form", async () => {
    SocketManager.changePassword = jest.fn();
    const {inputEmail, form} = getFields();

    await user.type(inputEmail, testConstants.validEmail);

    fireEvent.submit(form);

    expect(SocketManager.changePassword).toBeCalled();
    expect(inputEmail.value).toBe(testConstants.validEmail);
    expect(form.classList.contains("was-validated")).toBeTruthy();
    expect(form.dataset.error).toBe(FormErrorType.NO_ERROR);
});

function getFields() {
    const form = document.querySelector("form");
    const inputEmail = document.getElementById("email");
    return {form, inputEmail};
}
