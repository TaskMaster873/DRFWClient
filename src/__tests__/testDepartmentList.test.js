/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import {render} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {departmentTableHeads} from "../src/engine/types/Department";
import {ComponentDepartmentList} from "../src/engine/components/ComponentDepartmentList";
import {departments, departments2, employeeNb, employees, employees2} from "../Constants/testConstants";

jest.mock("../src/engine/api/APIManager");
test("should render department informations", async () => {
    render(<MemoryRouter><ComponentDepartmentList departments={departments} employees={employees}
                                                  onAddDepartment={jest.fn()} employeeNb={employeeNb}
                                                  onEditDepartment={jest.fn()} onDeleteDepartment={jest.fn()}/></MemoryRouter>);
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
    verifyTableLength(ths, trs, tds, departments);
});

test("should have correct length based on department list", async () => {
    render(<MemoryRouter><ComponentDepartmentList departments={departments2} employees={employees}
                                                  onAddDepartment={jest.fn()} employeeNb={employeeNb}
                                                  onEditDepartment={jest.fn()} onDeleteDepartment={jest.fn()}/></MemoryRouter>);
    const {
        ths,
        trs,
        tds,
    } = getFields();

    verifyTableLength(ths, trs, tds, departments2);
});

test("Table heads should have proper values", async () => {
    render(<MemoryRouter><ComponentDepartmentList departments={departments} employees={employees}
          onAddDepartment={jest.fn()} employeeNb={employeeNb}
          onEditDepartment={jest.fn()} onDeleteDepartment={jest.fn()}/></MemoryRouter>);
    const {
        ths,
    } = getFields();

    checkTableHeads(ths);
});

test("Table heads should have proper values 2", async () => {
    render(<MemoryRouter><ComponentDepartmentList departments={departments2} employees={employees2}
           onAddDepartment={jest.fn()} employeeNb={employeeNb}
           onEditDepartment={jest.fn()} onDeleteDepartment={jest.fn()}/></MemoryRouter>);
    const {
        ths,
    } = getFields();

    checkTableHeads(ths);
});

test("Department number should be incremental", async () => {
    render(<MemoryRouter><ComponentDepartmentList departments={departments} employees={employees}
            onAddDepartment={jest.fn()} employeeNb={employeeNb}
            onEditDepartment={jest.fn()} onDeleteDepartment={jest.fn()}/></MemoryRouter>);
    const {
        trs,
        ths,
        tds,
    } = getFields();


    verifyDepartmentNumber(ths, trs, tds);
});

test("Department number should be incremental 2", async () => {
    render(<MemoryRouter><ComponentDepartmentList departments={departments} employees={employees}
           onAddDepartment={jest.fn()} employeeNb={employeeNb}
           onEditDepartment={jest.fn()} onDeleteDepartment={jest.fn()}/></MemoryRouter>);
    const {
        trs,
        ths,
        tds,
    } = getFields();


    verifyDepartmentNumber(ths, trs, tds);
});

test("Department fields should match employee infos", async () => {
    render(<MemoryRouter><ComponentDepartmentList departments={departments} employees={employees}
            onAddDepartment={jest.fn()} employeeNb={employeeNb}
            onEditDepartment={jest.fn()} onDeleteDepartment={jest.fn()}/></MemoryRouter>);
    const {
        trs,
        ths,
        tds,
        tdLinks
    } = getFields();

    checkFieldValues(ths, trs, tds, tdLinks, departments);
});

test("Department fields should match employee infos 2", async () => {
    render(<MemoryRouter><ComponentDepartmentList departments={departments2} employees={employees2}
           onAddDepartment={jest.fn()} employeeNb={employeeNb}
           onEditDepartment={jest.fn()} onDeleteDepartment={jest.fn()}/></MemoryRouter>);
    const {
        trs,
        ths,
        tds,
        tdLinks
    } = getFields();

    checkFieldValues(ths, trs, tds, tdLinks, departments2);
});

function verifyTableLength(ths, trs, tds, list) {
    expect(ths.length).toBe(departmentTableHeads.length);
    expect(trs.length).toBe(list.length + 1);
    expect(tds.length).toBe(departmentTableHeads.length * list.length);
}

function checkTableHeads(ths) {
    for (let i = 0; i < ths.length; i++) {
        expect(ths[i].innerHTML).toBe(departmentTableHeads[i]);
    }
}

function verifyDepartmentNumber(ths, trs, tds) {
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

function checkFieldValues(ths, trs, tds, tdLinks, list) {
    /*
        i: nombre total de "table data"
     */
    for (let i = 0; i < trs.length - 1; i++) {
        expect(tdLinks[i].innerHTML).toBe(list[i].name);
        expect(tds[i * ths.length + 2].innerHTML).toBe(list[i].director);
        expect(tds[i * ths.length + 3].innerHTML).toBe(employeeNb[i].toString());
    }
}



function getFields() {
    const table = document.querySelector("table");
    const ths = document.querySelectorAll("th");
    const trs = document.querySelectorAll("tr");
    const tds = document.querySelectorAll("td");
    const tdLinks = document.querySelectorAll("td > a");

    return {
        table,
        ths,
        trs,
        tds,
        tdLinks
    };
}

