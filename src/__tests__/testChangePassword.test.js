import "@testing-library/react/dist/fire-event";
import "@testing-library/jest-dom";
import {fireEvent, render} from "@testing-library/react";
import {FormErrorType} from "../src/engine/messages/FormMessages";
import testConstants from "../Constants/testConstants";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from "react-router-dom";
import {ChangePassword} from "../src/engine/pages/changePassword";
import {SocketManager} from "../src/engine/networking/WebsocketManager";


let user;
beforeEach(async () => {
    user = userEvent.setup();
    render(<MemoryRouter><ChangePassword/></MemoryRouter>);
});

test("should render form inputs", async () => {
    const {inputOldPassword, form, inputNewPassword} = getFields();

    expect(form).not.toBeNull();
    expect(inputOldPassword).not.toBeNull();
    expect(inputNewPassword).not.toBeNull();
    expect(inputOldPassword).toHaveAttribute("type", "password");
    expect(inputNewPassword).toHaveAttribute("type", "password");
});

describe("Empty Fields change password validation", () => {
    test("Empty old password should show error", async () => {
        const {inputOldPassword, form, inputNewPassword} = getFields();

        await user.type(inputNewPassword, testConstants.validNewPassword);

        fireEvent.submit(form);

        expect(inputOldPassword.value).toBe("");
        expect(inputNewPassword.value).toBe(testConstants.validNewPassword);
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });

    test("Empty new password should show error", async () => {
        const {inputOldPassword, form, inputNewPassword} = getFields();

        await user.type(inputOldPassword, testConstants.validPassword);

        fireEvent.submit(form);

        expect(inputOldPassword.value).toBe(testConstants.validPassword);
        expect(inputNewPassword.value).toBe("");
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });
});

test("Valid old and new password should submit form", async () => {
    SocketManager.changePassword = jest.fn();
    const {inputOldPassword, form, inputNewPassword} = getFields();

    await user.type(inputOldPassword, testConstants.validPassword);
    await user.type(inputNewPassword, testConstants.validNewPassword);

    fireEvent.submit(form);

    expect(SocketManager.changePassword).toBeCalled();
    expect(inputOldPassword.value).toBe(testConstants.validPassword);
    expect(inputNewPassword.value).toBe(testConstants.validNewPassword);
    expect(form.classList.contains("was-validated")).toBeTruthy();
    expect(form.dataset.error).toBe(FormErrorType.NO_ERROR);
});

function getFields() {
    const form = document.querySelector("form");
    const inputOldPassword = document.getElementById("oldPassword");
    const inputNewPassword = document.getElementById("newPassword");
    return {inputNewPassword, form, inputOldPassword};
}
