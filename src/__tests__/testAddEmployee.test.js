/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import {fireEvent, render} from "@testing-library/react";
import {FormErrorType} from "../src/engine/messages/FormMessages";
import {departments2, jobTitles, roles, skills, testConstants} from "../Constants/testConstants";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from "react-router-dom";
import {ComponentAddEmployee} from "../src/engine/components/ComponentAddEmployee";
import {API} from "../src/engine/api/APIManager";
let user;

beforeEach(async () => {
    user = userEvent.setup();
    render(<MemoryRouter>
        <ComponentAddEmployee departments={departments2} roles={roles}
            jobTitles={jobTitles} skills={skills} onAddEmployee={jest.fn()} onAddJobTitle={jest.fn()}
            onAddSkill={jest.fn()} onEditJobTitle={jest.fn()} onEditSkill={jest.fn()}
            onDeleteJobTitle={jest.fn()} onDeleteSkill={jest.fn()}/>
    </MemoryRouter>);
});

test("should render form inputs", async () => {
    const {
        form,
        inputFirstName,
        inputName,
        inputPhoneNumber,
        inputInitialPassword,
        selectDepartment,
        checksJobTitle,
        checksSkills,
        inputEmail,
    } = getFields();

    expect(form).not.toBeNull();
    expect(inputEmail).not.toBeNull();
    expect(inputFirstName).not.toBeNull();
    expect(inputName).not.toBeNull();
    expect(inputPhoneNumber).not.toBeNull();
    expect(inputInitialPassword).not.toBeNull();
    expect(selectDepartment).not.toBeNull();
    expect(checksJobTitle).not.toBeNull();
    expect(checksSkills).not.toBeNull();
    expect(inputPhoneNumber).toHaveAttribute("type", "tel");
    expect(inputInitialPassword).toHaveAttribute("type", "password");
    expect(inputEmail).toHaveAttribute("type", "email");
});

describe("Empty Fields AddEmployee Tests", () => {
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

        await user.type(inputEmail, testConstants.validEmail);
        await user.type(inputName, testConstants.validName);
        await user.type(inputPhoneNumber, testConstants.validPhoneNumber);
        await user.type(inputInitialPassword, testConstants.validPassword);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.validEmail);
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

        await user.type(inputEmail, testConstants.validEmail);
        await user.type(inputFirstName, testConstants.validFirstName);
        await user.type(inputPhoneNumber, testConstants.validPhoneNumber);
        await user.type(inputInitialPassword, testConstants.validPassword);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.validEmail);
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

        await user.type(inputEmail, testConstants.validEmail);
        await user.type(inputFirstName, testConstants.validFirstName);
        await user.type(inputName, testConstants.validName);
        await user.type(inputInitialPassword, testConstants.validPassword);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.validEmail);
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

        await user.type(inputEmail, testConstants.validEmail);
        await user.type(inputFirstName, testConstants.validFirstName);
        await user.type(inputName, testConstants.validName);
        await user.type(inputPhoneNumber, testConstants.validPhoneNumber);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.validEmail);
        expect(inputFirstName.value).toBe(testConstants.validFirstName);
        expect(inputName.value).toBe(testConstants.validName);
        expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
        expect(inputInitialPassword.value).toBe("");
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
            inputInitialPassword,
        } = getFields();

        await user.type(inputEmail, testConstants.invalidEmail);
        await user.type(inputFirstName, testConstants.validFirstName);
        await user.type(inputName, testConstants.validName);
        await user.type(inputPhoneNumber, testConstants.validPhoneNumber);
        await user.type(inputInitialPassword, testConstants.validPassword);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.invalidEmail);
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
            inputInitialPassword
        } = getFields();

        await user.type(inputEmail, testConstants.validEmail);
        await user.type(inputFirstName, testConstants.validFirstName);
        await user.type(inputName, testConstants.validName);
        await user.type(inputPhoneNumber, testConstants.invalidPhoneNumber);
        await user.type(inputInitialPassword, testConstants.validPassword);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.validEmail);
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
            inputInitialPassword
        } = getFields();

        await user.type(inputEmail, testConstants.validEmail);
        await user.type(inputFirstName, testConstants.validFirstName);
        await user.type(inputName, testConstants.validName);
        await user.type(inputPhoneNumber, testConstants.validPhoneNumber);
        await user.type(inputInitialPassword, testConstants.invalidPassword);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.validEmail);
        expect(inputFirstName.value).toBe(testConstants.validFirstName);
        expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
        expect(inputInitialPassword.value).toBe(testConstants.invalidPassword);
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });
});
//Will work later, after Context is made and mocked

test("Valid employee infos should submit form", async () => {
    API.createEmployee = jest.fn(() => Promise.resolve(null));
    const {
        form,
        inputEmail,
        inputFirstName,
        inputName,
        inputPhoneNumber,
        inputInitialPassword,
    } = getFields();

    await user.type(inputName, testConstants.validName);
    await user.type(inputEmail, testConstants.validEmail);
    await user.type(inputFirstName, testConstants.validFirstName);
    await user.type(inputPhoneNumber, testConstants.validPhoneNumber);
    await user.type(inputInitialPassword, testConstants.validPassword);

    fireEvent.submit(form);

    expect(inputEmail.value).toBe(testConstants.validEmail);
    expect(inputFirstName.value).toBe(testConstants.validFirstName);
    expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
    expect(inputInitialPassword.value).toBe(testConstants.validPassword);
    expect(form.classList.contains("was-validated")).toBeTruthy();
    expect(form.dataset.error).toBe(FormErrorType.NO_ERROR);
});

describe("Optional fields AddEmployee tests", () => {
    test("Adding jobTitle should be valid", async () => {
        API.createEmployee = jest.fn(() => Promise.resolve(null));
        const {
            form,
            inputEmail,
            inputFirstName,
            inputName,
            inputPhoneNumber,
            inputInitialPassword,
            checksJobTitle
        } = getFields();

        await user.type(inputEmail, testConstants.validEmail);
        await user.type(inputFirstName, testConstants.validFirstName);
        await user.type(inputName, testConstants.validName);
        await user.type(inputPhoneNumber, testConstants.validPhoneNumber);
        await user.type(inputInitialPassword, testConstants.validPassword);
        await user.click(checksJobTitle[0]);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.validEmail);
        expect(inputFirstName.value).toBe(testConstants.validFirstName);
        expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
        expect(inputInitialPassword.value).toBe(testConstants.validPassword);
        expect(checksJobTitle[0].checked).toBeTruthy();
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.NO_ERROR);
    });

    test("Adding skill should be valid", async () => {
        API.createEmployee = jest.fn(() => Promise.resolve(null));
        const {
            form,
            inputEmail,
            inputFirstName,
            inputName,
            inputPhoneNumber,
            inputInitialPassword,
            checksSkills
        } = getFields();

        await user.type(inputEmail, testConstants.validEmail);
        await user.type(inputFirstName, testConstants.validFirstName);
        await user.type(inputName, testConstants.validName);
        await user.type(inputPhoneNumber, testConstants.validPhoneNumber);
        await user.type(inputInitialPassword, testConstants.validPassword);
        await user.click(skills[0]);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.validEmail);
        expect(inputFirstName.value).toBe(testConstants.validFirstName);
        expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
        expect(inputInitialPassword.value).toBe(testConstants.validPassword);
        expect(checksSkills[0].checked).toBeTruthy();
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.NO_ERROR);
        expect(API.createEmployee).toBeCalled()
    });

    test("Can change role input valid", async () => {
        API.createEmployee = jest.fn(() => Promise.resolve(null));
        const {
            form,
            inputEmail,
            inputFirstName,
            inputName,
            inputPhoneNumber,
            inputInitialPassword,
            selectRole,
        } = getFields();

        await user.type(inputEmail, testConstants.validEmail);
        await user.type(inputFirstName, testConstants.validFirstName);
        await user.type(inputName, testConstants.validName);
        await user.type(inputPhoneNumber, testConstants.validPhoneNumber);
        await user.type(inputInitialPassword, testConstants.validPassword);
        await user.selectOptions(selectRole, roles[1]);

        fireEvent.submit(form);

        expect(inputEmail.value).toBe(testConstants.validEmail);
        expect(inputFirstName.value).toBe(testConstants.validFirstName);
        expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
        expect(inputInitialPassword.value).toBe(testConstants.validPassword);
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(selectRole.value).toBe(roles[1]);
        expect(form.dataset.error).toBe(FormErrorType.NO_ERROR);
        expect(API.createEmployee).toBeCalled()
    });
});


function getFields() {
    const form = document.querySelector("form");
    const inputFirstName = document.getElementsByName("firstName")[0];
    const inputName = document.getElementsByName("lastName")[0];
    const inputEmail = document.getElementsByName("email")[0];
    const inputPhoneNumber = document.getElementsByName("phoneNumber")[0];
    const inputInitialPassword = document.getElementsByName("password")[0];
    const selectDepartment = document.getElementsByName("department")[0];
    const selectRole = document.getElementsByName("role")[0];
    const checksJobTitle = document.getElementsByName("jobTitles");
    const checksSkills = document.getElementsByName("skills");

    return {
        checksJobTitle,
        checksSkills,
        form,
        selectDepartment,
        inputEmail,
        inputFirstName,
        inputInitialPassword,
        inputName,
        inputPhoneNumber,
        selectRole
    };
}
