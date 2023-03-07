/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import {fireEvent, render, screen} from "@testing-library/react";
import {FormErrorType} from "../src/engine/messages/FormMessages";
import {departments2, employee, jobTitles, roles, skills, testConstants} from "../Constants/testConstants";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from "react-router-dom";
import {ComponentEditEmployee} from "../src/engine/components/ComponentEditEmployee";
import {API} from "../src/engine/api/APIManager";
let user;
API.hasLowerPermission = jest.fn(() => true);
let onEditEmployee = jest.fn();

beforeEach(async () => {
    user = userEvent.setup();
    render(<MemoryRouter>
        <ComponentEditEmployee departments={departments2} jobTitles={jobTitles} editedEmployee={employee} roles={roles} skills={skills} employeeId={employee.id}
                               onEditEmployee={onEditEmployee} onAddJobTitle={jest.fn()} onAddSkill={jest.fn()} onDeleteJobTitle={jest.fn()}
                               onDeleteSkill={jest.fn()} onEditJobTitle={jest.fn()} onEditSkill={jest.fn()}/>
    </MemoryRouter>);
});

test("should render form inputs", async () => {
    const {
        form,
        inputFirstName,
        inputLastName,
        inputPhoneNumber,
        selectDepartment,
        selectRole,
        checksJobTitle,
        checksSkills
    } = getFields();

    expect(form).not.toBeNull();
    expect(inputFirstName).not.toBeNull();
    expect(inputLastName).not.toBeNull();
    expect(inputPhoneNumber).not.toBeNull();
    expect(selectDepartment).not.toBeNull();
    expect(selectRole).not.toBeNull();
    expect(checksJobTitle).not.toBeNull();
    expect(checksSkills).not.toBeNull();
    expect(inputPhoneNumber).toHaveAttribute("type", "tel");
});

test("should have default values on initialization", async () => {
    const {
        inputFirstName,
        inputLastName,
        inputPhoneNumber,
        selectDepartment,
        selectRole,
        checksJobTitle,
        checksSkills
    } = getFields();

    expect(inputFirstName.value).toBe(employee.firstName);
    expect(inputLastName.value).toBe(employee.lastName);
    expect(inputPhoneNumber.value).toBe(employee.phoneNumber);
    expect(selectDepartment.value).toBe(employee.department);
    expect(selectRole.value).toBe(employee.role.toString());
    expect(checksJobTitle[0].value).toBe(jobTitles[0].name);
    expect(checksSkills[0].value).toBe(skills[0].name);
    expect(checksJobTitle[0].checked).toBeTruthy();
    expect(checksSkills[0].checked).toBeTruthy();
});

describe("Empty Fields EditEmployee Tests", () => {
    test("Empty first name should show error", async () => {
        const {
            form,
            inputFirstName,
        } = getFields();

        await user.clear(inputFirstName);

        fireEvent.submit(form);

        expect(inputFirstName.value).toBe("");
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });

    test("Empty last name should show error", async () => {
        const {
            form,
            inputLastName,
        } = getFields();

        await user.clear(inputLastName);

        fireEvent.submit(form);

        expect(inputLastName.value).toBe("");
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });

    test("Empty phone number should show error", async () => {
        const {
            form,
            inputPhoneNumber,
        } = getFields();

        await user.clear(inputPhoneNumber);

        fireEvent.submit(form);

        expect(inputPhoneNumber.value).toBe("");
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });
});

describe("Regex Validation EditEmployee Tests", () => {
    test("Invalid phone number regex should show error", async () => {
        const {
            form,
            inputPhoneNumber,
        } = getFields();

        await user.clear(inputPhoneNumber);
        await user.type(inputPhoneNumber, testConstants.invalidPhoneNumber);

        fireEvent.submit(form);

        expect(inputPhoneNumber.value).toBe(testConstants.invalidPhoneNumber);
        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });
});

test("Valid employee infos should submit form", async () => {
    const {
        form,
    } = getFields();

    fireEvent.submit(form);

    expect(form.classList.contains("was-validated")).toBeTruthy();
    expect(form.dataset.error).toBe(FormErrorType.NO_ERROR);
});

function getFields() {
    const form = document.querySelector("form");
    const inputFirstName = document.getElementsByName("firstName")[0];
    const inputName = document.getElementsByName("lastName")[0];
    const inputPhoneNumber = document.getElementsByName("phoneNumber")[0];
    const selectDepartment = document.getElementsByName("department")[0];
    const selectRole = document.getElementsByName("role")[0];
    const checksJobTitle = document.getElementsByName("jobTitles");
    const checksSkills = document.getElementsByName("skills");
    return {
        form,
        inputFirstName,
        inputLastName: inputName,
        inputPhoneNumber,
        selectDepartment,
        selectRole,
        checksJobTitle,
        checksSkills
    };
}
