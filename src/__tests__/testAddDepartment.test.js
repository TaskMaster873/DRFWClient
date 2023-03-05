/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import {fireEvent, render} from "@testing-library/react";
import {FormErrorType} from "../src/engine/messages/FormMessages";
import {employees} from "../Constants/testConstants";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from "react-router-dom";
import {ComponentAddDepartment} from "../src/engine/components/ComponentAddDepartment";
jest.mock("../src/engine/api/APIManager");
let user;

beforeEach(async () => {
    user = userEvent.setup();
    render(<MemoryRouter>
        <ComponentAddDepartment employees={employees} onAddDepartment={jest.fn()}/>
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
    test("Empty employee number should show error", async () => {
        const {
            form,
            inputName,
            inputDirector
        } = getFields();


        fireEvent.submit(form);


        expect(inputName.value).toBe("");
        expect(inputDirector.value).toBe(`${employees[0].firstName} ${employees[0].lastName}`);

        expect(form.classList.contains("was-validated")).toBeTruthy();

        expect(form.dataset.error).toBe(FormErrorType.INVALID_FORM);
    });
});

/* //Will work later, after Context is made and mocked
test("Valid employee number and password should submit form", async () => {
    const {
            form,
            inputName,
            inputDirector
        } = getFields();

    await user.type(inputName, testConstants.validDepartment);

    fireEvent.submit(form);

    expect(inputName.value).toBe(testConstants.validDepartment);
    expect(form.classList.contains("was-validated")).toBeTruthy();
    expect(form.dataset.error).toBe(FormErrorType.NO_ERROR);
    expect()
});
*/

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
