/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import {fireEvent, render} from "@testing-library/react";
import {FormErrorType} from "../src/engine/messages/FormMessages";
import {department, employees2} from "../Constants/testConstants";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from "react-router-dom";
import {ComponentAddDepartment} from "../src/engine/components/ComponentAddDepartment";

let user;
const onAddDepartment = jest.fn();
beforeEach(async () => {
    user = userEvent.setup();
    render(<MemoryRouter>
        <ComponentAddDepartment employees={employees2} onAddDepartment={onAddDepartment}/>
    </MemoryRouter>);
});

test("should render form inputs", async () => {
    const {
        form,
        inputName,
        inputDirector
    } = getFields();

    expect(form).not.toBeNull();
    expect(inputName).not.toBeNull();
    expect(inputDirector).not.toBeNull();
});

describe("Empty Fields AddDepartment Tests", () => {
    test("Empty name should show error", async () => {
        const {
            form,
            inputName,
            inputDirector
        } = getFields();

        fireEvent.submit(form);

        expect(inputName.value).toBe("");
        expect(inputDirector.value).toBe(`${employees2[0].firstName} ${employees2[0].lastName}`);

        expect(form.classList.contains("was-validated")).toBeTruthy();
        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });
});

test("Valid name should submit form", async () => {
    const {
        form,
        inputName,
    } = getFields();

    await user.type(inputName, department.name);

    fireEvent.submit(form);

    expect(inputName.value).toBe(department.name);
    expect(form.classList.contains("was-validated")).toBeTruthy();
    expect(form.dataset.error).toBe(FormErrorType.NO_ERROR);
    expect(onAddDepartment).toHaveBeenCalled();
});

test("Select director should render", async () => {
    const {
        form,
        inputName,
        inputDirector
    } = getFields();
    const index = 1;
    const employeeFullName = `${employees2[index].firstName} ${employees2[index].lastName}`;

    await user.type(inputName, department.name);
    await user.selectOptions(inputDirector, employeeFullName);

    fireEvent.submit(form);

    expect(inputName.value).toBe(department.name);
    expect(inputDirector.value).toBe(employeeFullName);
    expect(form.classList.contains("was-validated")).toBeTruthy();
    expect(form.dataset.error).toBe(FormErrorType.NO_ERROR);
    expect(onAddDepartment).toHaveBeenCalled();
});

function getFields() {
    const form = document.querySelector("form");
    const inputName = document.getElementsByName("name")[0];
    const inputDirector = document.getElementsByName("director")[0];
    return {
        form,
        inputName,
        inputDirector,
    };
}
