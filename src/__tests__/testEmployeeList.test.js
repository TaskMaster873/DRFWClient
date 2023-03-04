/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import {render} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {ComponentEmployeeList} from "../src/engine/components/ComponentEmployeeList";
import {employeeTableHeads} from "../src/engine/types/Employee";
import {department, employees, employees2} from "../Constants/testConstants";

jest.mock("../src/engine/api/APIManager");

test("should render employee informations", async () => {
    render(<MemoryRouter><ComponentEmployeeList department={department.name} employees={employees}
                                                list={employees} filteredList={employees}
                                                onEmployeeActivationChange={jest.fn()}/></MemoryRouter>);
    const {
        table,
        ths,
        trs,
        tds,
    } = getFields();

    expect(table).not.toBeNull();
    expect(ths).not.toBeNull();
    expect(trs).not.toBeNull();
    expect(tds).not.toBeNull();
    verifyTableLength(ths, trs, tds, employees);
});

test("should have correct length based on employee list", async () => {
    render(<MemoryRouter><ComponentEmployeeList department={department.name} employees={employees2}
                                                list={employees2} filteredList={employees}
                                                onEmployeeActivationChange={jest.fn()}/></MemoryRouter>);
    const {
        ths,
        trs,
        tds,
    } = getFields();

    verifyTableLength(ths, trs, tds, employees2);
});

test("Table heads should have proper values", async () => {
    render(<MemoryRouter><ComponentEmployeeList department={department.name} employees={employees}
                                                list={employees} filteredList={employees}
                                                onEmployeeActivationChange={jest.fn()}/></MemoryRouter>);
    const {
        ths,
    } = getFields();

    checkTableHeads(ths);
});

test("Table heads should have proper values 2", async () => {
    render(<MemoryRouter><ComponentEmployeeList department={department.name} employees={employees2}
                                                list={employees2} filteredList={employees}
                                                onEmployeeActivationChange={jest.fn()}/></MemoryRouter>);
    const {
        ths,
    } = getFields();

    checkTableHeads(ths);
});

test("Employee number should be incremental", async () => {
    render(<MemoryRouter><ComponentEmployeeList department={department.name} employees={employees}
                                                list={employees} filteredList={employees}
                                                onEmployeeActivationChange={jest.fn()}/></MemoryRouter>);
    const {
        trs,
        ths,
        tds,
    } = getFields();


    verifyEmployeeNumber(ths, trs, tds);
});

test("Employee number should be incremental 2", async () => {
    render(<MemoryRouter><ComponentEmployeeList department={department.name} employees={employees2}
                                                list={employees2} filteredList={employees}
                                                onEmployeeActivationChange={jest.fn()}/></MemoryRouter>);
    const {
        trs,
        ths,
        tds,
    } = getFields();


    verifyEmployeeNumber(ths, trs, tds);
});

test("Employee fields should match employee infos", async () => {
    render(<MemoryRouter><ComponentEmployeeList department={department.name} employees={employees}
                                                list={employees} filteredList={employees}
                                                onEmployeeActivationChange={jest.fn()}/></MemoryRouter>);
    const {
        trs,
        ths,
        tds,
    } = getFields();

    checkFieldValues(ths, trs, tds, employees);
});

test("Employee fields should match employee infos 2", async () => {
    render(<MemoryRouter><ComponentEmployeeList department={department.name} employees={employees2}
                                                list={employees2} filteredList={employees}
                                                onEmployeeActivationChange={jest.fn()}/></MemoryRouter>);
    const {
        trs,
        ths,
        tds,
    } = getFields();

    checkFieldValues(ths, trs, tds, employees2);
});

/**
 * Check the length values of the displayed list
 * @param ths Table Heads
 */
function verifyTableLength(ths, trs, tds, list) {
    expect(ths.length).toBe(employeeTableHeads.length);
    expect(trs.length).toBe(list.length + 1);
    expect(tds.length).toBe((employeeTableHeads.length) * list.length);
}

/**
 * Check each value of table heads to equal the ones of the expected array
 * @param ths Table Heads
 */
function checkTableHeads(ths) {
    for (let i = 0; i < ths.length; i++) {
        expect(ths[i].innerHTML).toBe(employeeTableHeads[i]);
    }
}

/**
 * Verify every first element of each row to be the row index
 * @param ths Table Heads
 * @param trs Table Rows
 * @param tds Table Data Cell
 */
function verifyEmployeeNumber(ths, trs, tds) {
    /*
        i: nombre total de "table data"
        j: index représente le numéro courant d'employé
     */
    let j = 0;
    for (let i = 1; i < trs.length; i++) {
        expect(tds[j].innerHTML).toBe(i.toString());
        j += ths.length;
    }
}

/**
 * Verify the innerHTML of every element of each row to be equal to the list of employees
 * @param ths Table Heads
 * @param trs Table Rows
 * @param tds Table Data Cell
 * @param list The list of employees
 */
function checkFieldValues(ths, trs, tds, list) {
    /*
        i: nombre total de "table data"
     */
    for (let i = 0; i < trs.length - 1; i++) {
        expect(tds[i * ths.length + 1].innerHTML).toBe(list[i].firstName);
        expect(tds[i * ths.length + 2].innerHTML).toBe(list[i].lastName);
        expect(tds[i * ths.length + 3].innerHTML).toBe(list[i].email);
        expect(tds[i * ths.length + 4].innerHTML).toBe(list[i].phoneNumber);
        expect(tds[i * ths.length + 5].innerHTML).toBe(list[i].department);
        expect(tds[i * ths.length + 6].innerHTML).toBe(list[i].isActive ? "Oui" : "Non");
        expect(tds[i * ths.length + 7].innerHTML).toBe(`<div class="list-group list-group-flush">${expectedListItems(list[i].jobTitles)}</div>`);
        expect(tds[i * ths.length + 8].innerHTML).toBe(`<div class="list-group list-group-flush">${expectedListItems(list[i].skills)}</div>`);
    }
}

/**
 * Returns each list item to expect in the interface
 * @param array
 * @returns {string}
 */
function expectedListItems(array) {
    let listItems = ``;
    if(array.size === 0) return listItems;
    for (const elem of array) {
        listItems +=`<div class="list-group-item">${elem}</div>`
    }
    return listItems;
}

/**
 * Get all the fields needed in tests
 * @returns {{tds: NodeListOf<HTMLElementTagNameMap[string]>, trs: NodeListOf<HTMLElementTagNameMap[string]>, table: HTMLTableElement, ths: NodeListOf<HTMLElementTagNameMap[string]>}}
 */
function getFields() {
    const table = document.querySelector("table");
    const ths = document.querySelectorAll("th");
    const trs = document.querySelectorAll("tr");
    const tds = document.querySelectorAll("td");

    return {
        table,
        ths,
        trs,
        tds,
    };
}

