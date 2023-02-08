/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import {fireEvent, render} from "@testing-library/react";
import {FormErrorType} from "../src/engine/messages/FormMessages";
import testConstants from "../Constants/testConstants";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from "react-router-dom";
import {AddEmployee} from "../src/engine/pages/addEmployee";

let user;


beforeEach(async () => {
    user = userEvent.setup();
    render(<MemoryRouter><AddEmployee/></MemoryRouter>);
});

test("should render form inputs", async () => {
    const {
        form,
        inputEmail,
        inputFirstName,
        inputName,
        inputPhoneNumber,
        inputInitialPassword,
    } = getFields();

    expect(form).not.toBeNull();
    expect(inputEmail).not.toBeNull();
    expect(inputFirstName).not.toBeNull();
    expect(inputName).not.toBeNull();
    expect(inputPhoneNumber).not.toBeNull();
    expect(inputInitialPassword).not.toBeNull();
    expect(inputPhoneNumber).toHaveAttribute("type", "tel");
    expect(inputInitialPassword).toHaveAttribute("type", "password");
});

describe("Empty Fields Login Tests", () => {
    test("Empty employee number should show error", async () => {
        const {
            form,
            inputEmail,
            inputFirstName,
            inputName,
            inputPhoneNumber,
            inputInitialPassword,
        } = getFields();

        await user.type(inputFirstName, testConstants.validFirstName);
        await user.type(inputName, testConstants.validName);
        await user.type(inputPhoneNumber, testConstants.validPhoneNumber);
        await user.type(inputInitialPassword, testConstants.validPassword);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe("");
        expect(inputFirstName.value).toBe(testConstants.validFirstName);
        expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
        expect(inputInitialPassword.value).toBe(testConstants.validPassword);

        expect(form.classList.contains("was-validated")).toBeTruthy();

        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });

    test("Empty first name should show error", async () => {
        const {
            form,
            inputEmail,
            inputFirstName,
            inputName,
            inputPhoneNumber,
            inputInitialPassword,
        } = getFields();

        await user.type(inputEmail, testConstants.validIdEmployee);
        await user.type(inputName, testConstants.validName);
        await user.type(inputPhoneNumber, testConstants.validPhoneNumber);
        await user.type(inputInitialPassword, testConstants.validPassword);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.validIdEmployee);
        expect(inputFirstName.value).toBe("");
        expect(inputName.value).toBe(testConstants.validName);
        expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
        expect(inputInitialPassword.value).toBe(testConstants.validPassword);
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });

    test("Empty name should show error", async () => {
        const {
            form,
            inputEmail,
            inputFirstName,
            inputName,
            inputPhoneNumber,
            inputInitialPassword,
        } = getFields();

        await user.type(inputEmail, testConstants.validIdEmployee);
        await user.type(inputFirstName, testConstants.validFirstName);
        await user.type(inputPhoneNumber, testConstants.validPhoneNumber);
        await user.type(inputInitialPassword, testConstants.validPassword);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.validIdEmployee);
        expect(inputFirstName.value).toBe(testConstants.validFirstName);
        expect(inputName.value).toBe("");
        expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
        expect(inputInitialPassword.value).toBe(testConstants.validPassword);
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });

    test("Empty phone number should show error", async () => {
        const {
            form,
            inputEmail,
            inputFirstName,
            inputName,
            inputPhoneNumber,
            inputInitialPassword,
        } = getFields();

        await user.type(inputEmail, testConstants.validIdEmployee);
        await user.type(inputFirstName, testConstants.validFirstName);
        await user.type(inputName, testConstants.validName);
        await user.type(inputInitialPassword, testConstants.validPassword);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.validIdEmployee);
        expect(inputFirstName.value).toBe(testConstants.validFirstName);
        expect(inputName.value).toBe(testConstants.validName);
        expect(inputPhoneNumber.value).toBe("");
        expect(inputInitialPassword.value).toBe(testConstants.validPassword);
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });

    test("Empty initial password should show error", async () => {
        const {
            form,
            inputEmail,
            inputFirstName,
            inputName,
            inputPhoneNumber,
            inputInitialPassword,
        } = getFields();

        await user.type(inputEmail, testConstants.validIdEmployee);
        await user.type(inputFirstName, testConstants.validFirstName);
        await user.type(inputName, testConstants.validName);
        await user.type(inputPhoneNumber, testConstants.validPhoneNumber);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.validIdEmployee);
        expect(inputFirstName.value).toBe(testConstants.validFirstName);
        expect(inputName.value).toBe(testConstants.validName);
        expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
        expect(inputInitialPassword.value).toBe("");
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });
});

describe("Regex Validation AddEmployee Tests", () => {
    test("Invalid employee number regex should show error", async () => {
        const {
            form,
            inputEmail,
            inputFirstName,
            inputName,
            inputPhoneNumber,
            inputInitialPassword,
        } = getFields();

        await user.type(inputEmail, testConstants.invalidIdEmployee);
        await user.type(inputFirstName, testConstants.validFirstName);
        await user.type(inputName, testConstants.validName);
        await user.type(inputPhoneNumber, testConstants.validPhoneNumber);
        await user.type(inputInitialPassword, testConstants.validPassword);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.invalidIdEmployee);
        expect(inputFirstName.value).toBe(testConstants.validFirstName);
        expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
        expect(inputInitialPassword.value).toBe(testConstants.validPassword);
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });

    test("Invalid phone number regex should show error", async () => {
        const {
            form,
            inputEmail,
            inputFirstName,
            inputName,
            inputPhoneNumber,
            inputInitialPassword,
        } = getFields();

        await user.type(inputEmail, testConstants.validIdEmployee);
        await user.type(inputFirstName, testConstants.validFirstName);
        await user.type(inputName, testConstants.validName);
        await user.type(inputPhoneNumber, testConstants.invalidPhoneNumber);
        await user.type(inputInitialPassword, testConstants.validPassword);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.validIdEmployee);
        expect(inputFirstName.value).toBe(testConstants.validFirstName);
        expect(inputPhoneNumber.value).toBe(testConstants.invalidPhoneNumber);
        expect(inputInitialPassword.value).toBe(testConstants.validPassword);
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });

    test("Invalid initial password regex should show error", async () => {
        const {
            form,
            inputEmail,
            inputFirstName,
            inputName,
            inputPhoneNumber,
            inputInitialPassword,
        } = getFields();

        await user.type(inputEmail, testConstants.validIdEmployee);
        await user.type(inputFirstName, testConstants.validFirstName);
        await user.type(inputName, testConstants.validName);
        await user.type(inputPhoneNumber, testConstants.validPhoneNumber);
        await user.type(inputInitialPassword, testConstants.invalidPassword);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.validIdEmployee);
        expect(inputFirstName.value).toBe(testConstants.validFirstName);
        expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
        expect(inputInitialPassword.value).toBe(testConstants.invalidPassword);
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });
});
/* //Will work later, after Context is made and mocked
test("Valid employee number and password should submit form", async () => {
    const {
        form,
        inputEmail,
        inputFirstName,
        inputName,
        inputPhoneNumber,
        inputInitialPassword,
    } = getFields();

    await user.type(inputEmail, testConstants.validIdEmployee);
    await user.type(inputFirstName, testConstants.validFirstName);
    await user.type(inputName, testConstants.validName);
    await user.type(inputPhoneNumber, testConstants.validPhoneNumber);
    await user.type(inputInitialPassword, testConstants.validPassword);

    fireEvent.submit(form);

    expect(inputEmail.value).toBe(testConstants.validIdEmployee);
    expect(inputFirstName.value).toBe(testConstants.validFirstName);
    expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
    expect(inputInitialPassword.value).toBe(testConstants.validPassword);
    expect(form.classList.contains("was-validated")).toBeTruthy();
    expect(form.dataset.error).toBe(FormErrorType.NO_ERROR);
    expect()
});
*/

function getFields() {
    const form = document.querySelector("form");
    const inputFirstName = document.getElementById("firstName");
    const inputName = document.getElementById("lastName");
    const inputEmail = document.getElementById("email");
    const inputPhoneNumber = document.getElementById("phoneNumber");
    const inputInitialPassword = document.getElementById(
        "password"
    );
    return {
        form,
        inputEmail,
        inputFirstName,
        inputName,
        inputPhoneNumber,
        inputInitialPassword,
    };
}
