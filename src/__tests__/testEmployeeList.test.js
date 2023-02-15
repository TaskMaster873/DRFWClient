/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import {render} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {ComponentEmployeeList} from "../src/engine/components/ComponentEmployeeList";
import {Employee, employeeTableHeads} from "../src/engine/types/Employee";

jest.mock("../src/engine/api/APIManager");

let department = "Informatique";
let employee = new Employee({
    firstName: "George",
    lastName: "Belleau",
    email: "georgeBelleau@gmail.com",
    phoneNumber: "418-532-5323",
    department: "Construction",
    jobTitles: [],
    skills: [],
    role: 1,
})
let filteredList = [employee]

beforeEach(async () => {
    render(<MemoryRouter><ComponentEmployeeList department={department} filteredList={filteredList}
                                                list={filteredList}/></MemoryRouter>);
});

test("should render employee informations", async () => {
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
    expect(ths.length).toBe(Object.keys(employee).length);
    expect(trs.length).toBe(filteredList.length + 1);
    expect(tds.length).toBe(Object.keys(employee).length * filteredList.length);
});

test("Table heads should have proper values", async () => {
    const {
        ths,
    } = getFields();

    for (let i = 0; i < ths.length; i++) {
        expect(ths[i].innerHTML).toBe(employeeTableHeads[i]);
    }
});

test("Employee number should be incremental", async () => {
    const {
        trs,
        ths,
        tds,
    } = getFields();

    /*
        i: nombre total de "table data"
        j: index représente le numéro courant d'employé
     */
    let j = 0;
    for (let i = 1; i < trs.length; i++) {
        expect(tds[j].innerHTML).toBe(i.toString());
        j += ths.length;
    }
});

test("Employee fields should match employee infos", async () => {
    const {
        trs,
        ths,
        tds,
    } = getFields();

    /*
        i: nombre total de "table data"
     */
    for (let i = 0; i < trs.length - 1; i++) {
        expect(tds[i * ths.length + 1].innerHTML).toBe(employee.firstName);
        expect(tds[i * ths.length + 2].innerHTML).toBe(employee.lastName);
        expect(tds[i * ths.length + 3].innerHTML).toBe(employee.email);
        expect(tds[i * ths.length + 4].innerHTML).toBe(employee.phoneNumber);
        expect(tds[i * ths.length + 5].innerHTML).toBe(employee.department);
        expect(tds[i * ths.length + 6].innerHTML).toBe("Oui");
        expect(tds[i * ths.length + 7].innerHTML).toBe("");
        expect(tds[i * ths.length + 8].innerHTML).toBe("");
    }
});

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
