import "@testing-library/react/dist/fire-event";
import "@testing-library/jest-dom";
import {fireEvent, render} from "@testing-library/react";
import {FormErrorType} from "../src/engine/messages/FormMessages";
import {testConstants} from "../Constants/testConstants";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from "react-router-dom";
import {ChangePassword} from "../src/engine/pages/ChangePassword.tsx";

let user;
beforeEach(async () => {
    user = userEvent.setup();
    render(<MemoryRouter><ChangePassword/></MemoryRouter>);
});

test("should render form inputs", async () => {
    const {form, inputNewPassword} = getFields();

    expect(form).not.toBeNull();
    expect(inputNewPassword).not.toBeNull();
    expect(inputNewPassword).toHaveAttribute("type", "password");
});

describe("Empty Fields change password validation", () => {
    test("Empty new password should show error", async () => {
        const {inputNewPassword, form} = getFields();

        fireEvent.submit(form);

        expect(inputNewPassword.value).toBe("");
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });
});

test("Valid old and new password should submit form", async () => {
    const {form, inputNewPassword} = getFields();

    await user.type(inputNewPassword, testConstants.validNewPassword);

    fireEvent.submit(form);

    expect(inputNewPassword.value).toBe(testConstants.validNewPassword);
    expect(form.classList.contains("was-validated")).toBeTruthy();
    expect(form.dataset.error).toBe(FormErrorType.NO_ERROR);
});

function getFields() {
    const form = document.querySelector("form");
    const inputNewPassword = document.getElementsByName("newPassword")[0];
    return {inputNewPassword, form};
}
