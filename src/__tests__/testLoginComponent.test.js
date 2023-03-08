import "@testing-library/react/dist/fire-event";
import "@testing-library/jest-dom";
import {fireEvent, render} from "@testing-library/react";
import {FormErrorType} from "../src/engine/messages/FormMessages";
import {testConstants} from "../Constants/testConstants";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from "react-router-dom";
import {act} from "react-dom/test-utils";
jest.mock("tsparticles");
import {ComponentLogin} from "../src/engine/components/ComponentLogin";

let user;
const onLoginRequest = jest.fn();

beforeEach(async () => {
    user = userEvent.setup();
    act(() => {
        render(<MemoryRouter><ComponentLogin onLoginRequest={onLoginRequest}/></MemoryRouter>);
    });
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
    test("Empty employee email should show error", async () => {
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
    const {inputPassword, form, inputEmail} = getFields();

    await user.type(inputEmail, testConstants.validEmail);
    await user.type(inputPassword, testConstants.validPassword);

    fireEvent.submit(form);

    expect(inputEmail.value).toBe(testConstants.validEmail);
    expect(inputPassword.value).toBe(testConstants.validPassword);
    expect(form.classList.contains("was-validated")).toBeTruthy();
    expect(form.dataset.error).toBe(FormErrorType.NO_ERROR);
    expect(onLoginRequest).toHaveBeenCalled()
});

function getFields() {
    const form = document.querySelector("form");
    const inputEmail = document.getElementsByName("emailLogin")[0];
    const inputPassword = document.getElementsByName("passwordLogin")[0];
    return {inputPassword, form, inputEmail};
}
