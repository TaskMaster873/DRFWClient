/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import {fireEvent, render} from "@testing-library/react";
import {FormErrorType} from "../src/engine/messages/FormMessages";
import {departments, employee, jobTitles, roles, skills, testConstants} from "../Constants/testConstants";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from "react-router-dom";
import {ComponentEditEmployee} from "../src/engine/components/ComponentEditEmployee";

jest.mock("../src/engine/api/APIManager");
let user;

beforeEach(async () => {
    user = userEvent.setup();
    render(<MemoryRouter>
        <ComponentEditEmployee departments={departments} jobTitles={jobTitles} editedEmployee={employee} roles={roles} skills={skills} onAddJobTitle={jest.fn()} onAddSkill={jest.fn()}
                               onDeleteJobTitle={jest.fn()} onDeleteSkill={jest.fn()} onEditEmployee={jest.fn()} onEditJobTitle={jest.fn()} onEditSkill={jest.fn()}/>
    </MemoryRouter>);
});

test("should render form inputs", async () => {
    const {
        form,
        inputEmail,
        inputFirstName,
        inputName,
        inputPhoneNumber,
        selectDepartment,
        selectRole,
        checksJobTitle,
        checksSkills
    } = getFields();

    expect(form).not.toBeNull();
    expect(inputEmail).not.toBeNull();
    expect(inputFirstName).not.toBeNull();
    expect(inputName).not.toBeNull();
    expect(inputPhoneNumber).not.toBeNull();
    expect(selectDepartment).not.toBeNull();
    expect(selectRole).not.toBeNull();
    expect(checksJobTitle).not.toBeNull();
    expect(checksSkills).not.toBeNull();
    expect(inputPhoneNumber).toHaveAttribute("type", "tel");
});

describe("Empty Fields AddEmployee Tests", () => {
    test("Empty employee number should show error", async () => {
        const {
            form,
            inputEmail,
            inputFirstName,
            inputName,
            inputPhoneNumber,
        } = getFields();

        await user.type(inputFirstName, testConstants.validFirstName);
        await user.type(inputName, testConstants.validName);
        await user.type(inputPhoneNumber, testConstants.validPhoneNumber);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe("");
        expect(inputFirstName.value).toBe(testConstants.validFirstName);
        expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);

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
        } = getFields();

        await user.type(inputEmail, testConstants.validEmail);
        await user.type(inputName, testConstants.validName);
        await user.type(inputPhoneNumber, testConstants.validPhoneNumber);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.validEmail);
        expect(inputFirstName.value).toBe("");
        expect(inputName.value).toBe(testConstants.validName);
        expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
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
        } = getFields();

        await user.type(inputEmail, testConstants.validEmail);
        await user.type(inputFirstName, testConstants.validFirstName);
        await user.type(inputPhoneNumber, testConstants.validPhoneNumber);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.validEmail);
        expect(inputFirstName.value).toBe(testConstants.validFirstName);
        expect(inputName.value).toBe("");
        expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
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
        } = getFields();

        await user.type(inputEmail, testConstants.validEmail);
        await user.type(inputFirstName, testConstants.validFirstName);
        await user.type(inputName, testConstants.validName);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.validEmail);
        expect(inputFirstName.value).toBe(testConstants.validFirstName);
        expect(inputName.value).toBe(testConstants.validName);
        expect(inputPhoneNumber.value).toBe("");
        expect(inputInitialPassword.value).toBe(testConstants.validPassword);
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });
});

describe("Regex Validation AddEmployee Tests", () => {
    test("Invalid email regex should show error", async () => {
        const {
            form,
            inputEmail,
            inputFirstName,
            inputName,
            inputPhoneNumber,
        } = getFields();

        await user.type(inputEmail, testConstants.invalidEmail);
        await user.type(inputFirstName, testConstants.validFirstName);
        await user.type(inputName, testConstants.validName);
        await user.type(inputPhoneNumber, testConstants.validPhoneNumber);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.invalidEmail);
        expect(inputFirstName.value).toBe(testConstants.validFirstName);
        expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
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
        } = getFields();

        await user.type(inputEmail, testConstants.validEmail);
        await user.type(inputFirstName, testConstants.validFirstName);
        await user.type(inputName, testConstants.validName);
        await user.type(inputPhoneNumber, testConstants.invalidPhoneNumber);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.validEmail);
        expect(inputFirstName.value).toBe(testConstants.validFirstName);
        expect(inputPhoneNumber.value).toBe(testConstants.invalidPhoneNumber);
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });
});
//Will work later, after Context is made and mocked
/*
test("Valid employee number and password should submit form", async () => {
    const {
        form,
        inputEmail,
        inputFirstName,
        inputName,
        inputPhoneNumber,
        inputInitialPassword,
    } = getFields();

    await user.type(inputEmail, testConstants.validEmail);
    await user.type(inputFirstName, testConstants.validFirstName);
    await user.type(inputName, testConstants.validName);
    await user.type(inputPhoneNumber, testConstants.validPhoneNumber);
    await user.type(inputInitialPassword, testConstants.validPassword);

    fireEvent.submit(form);

    expect(inputEmail.value).toBe(testConstants.validEmail);
    expect(inputFirstName.value).toBe(testConstants.validFirstName);
    expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
    expect(inputInitialPassword.value).toBe(testConstants.validPassword);
    expect(form.classList.contains("was-validated")).toBeTruthy();
    expect(form.dataset.error).toBe(FormErrorType.NO_ERROR);
});*/

function getFields() {
    const form = document.querySelector("form");
    const inputFirstName = document.getElementsByName("firstName")[0];
    const inputName = document.getElementsByName("lastName")[0];
    const inputEmail = document.getElementsByName("email")[0];
    const inputPhoneNumber = document.getElementsByName("phoneNumber")[0];
    const selectRole = document.getElementsByName("role")[0];
    const checksJobTitle = document.getElementsByName("jobTitles");
    const checksSkills = document.getElementsByName("skills");
    return {
        form,
        inputEmail,
        inputFirstName,
        inputName,
        inputPhoneNumber,
        selectRole,
        checksJobTitle,
        checksSkills
    };
}
