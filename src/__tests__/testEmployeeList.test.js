/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import {render} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {ComponentEmployeeList} from "../src/engine/components/ComponentEmployeeList";
import {employeeTableHeads} from "../src/engine/types/Employee";
import {department, employee, employees, employees2} from "../Constants/testConstants";

jest.mock("../src/engine/api/APIManager");

test("should render employee informations", async () => {
    render(<MemoryRouter><ComponentEmployeeList department={department.name} employees={employees}
                                                list={employees} filteredList={employees}/></MemoryRouter>);
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
                                                list={employees2} filteredList={employees}/></MemoryRouter>);
    const {
        ths,
        trs,
        tds,
    } = getFields();

    verifyTableLength(ths, trs, tds, employees2);
});

test("Table heads should have proper values", async () => {
    render(<MemoryRouter><ComponentEmployeeList department={department.name} employees={employees}
                                                list={employees} filteredList={employees}/></MemoryRouter>);
    const {
        ths,
    } = getFields();

    checkTableHeads(ths);
});

test("Table heads should have proper values 2", async () => {
    render(<MemoryRouter><ComponentEmployeeList department={department.name} employees={employees2}
                                                list={employees2} filteredList={employees}/></MemoryRouter>);
    const {
        ths,
    } = getFields();

    checkTableHeads(ths);
});

test("Employee number should be incremental", async () => {
    render(<MemoryRouter><ComponentEmployeeList department={department.name} employees={employees}
                                                list={employees} filteredList={employees}/></MemoryRouter>);
    const {
        trs,
        ths,
        tds,
    } = getFields();


    verifyEmployeeNumber(ths, trs, tds);
});

test("Employee number should be incremental 2", async () => {
    render(<MemoryRouter><ComponentEmployeeList department={department.name} employees={employees2}
                                                list={employees2} filteredList={employees}/></MemoryRouter>);
    const {
        trs,
        ths,
        tds,
    } = getFields();


    verifyEmployeeNumber(ths, trs, tds);
});

test("Employee fields should match employee infos", async () => {
    render(<MemoryRouter><ComponentEmployeeList department={department.name} employees={employees}
                                                list={employees} filteredList={employees}/></MemoryRouter>);
    const {
        trs,
        ths,
        tds,
    } = getFields();

    checkFieldValues(ths, trs, tds, employees);
});

test("Employee fields should match employee infos 2", async () => {
    render(<MemoryRouter><ComponentEmployeeList department={department.name} employees={employees2}
                                                list={employees2} filteredList={employees}/></MemoryRouter>);
    const {
        trs,
        ths,
        tds,
    } = getFields();

    checkFieldValues(ths, trs, tds, employees2);
});

function verifyTableLength(ths, trs, tds, list) {
    expect(ths.length).toBe(Object.keys(employeeTableHeads).length);
    expect(trs.length).toBe(list.length + 1);
    expect(tds.length).toBe(Object.keys(employeeTableHeads).length * list.length);
}

function checkTableHeads(ths) {
    for (let i = 0; i < ths.length; i++) {
        expect(ths[i].innerHTML).toBe(employeeTableHeads[i]);
    }
}

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
        expect(tds[i * ths.length + 6].innerHTML).toBe("Oui");
        expect(tds[i * ths.length + 7].innerHTML).toBe("");
        expect(tds[i * ths.length + 8].innerHTML).toBe("");
    }
}



function getFields() {
    const table = document.querySelector("table");
    const ths = document.querySelectorAll("tr > th");
    const trs = document.querySelectorAll("tr");
    const tds = document.querySelectorAll("td");

    return {
        table,
        ths,
        trs,
        tds,
    };
}

