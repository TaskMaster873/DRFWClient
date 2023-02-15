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
    department: "Construction",
    email: "georgeBelleau@gmail.com",
    role: 1,
    phoneNumber: "418-532-5323",
    jobTitles: [],
    skills: []
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

test("Table fields should have proper values", async () => {
    const {
        ths,
        tds,
    } = getFields();

    /*
        i: nombre total de "table data"
        j: index dans les éléments d'employé
        z: index représente le numéro courant d'employé
     */

    for (let i = 0, j = 0, z = 0; i < tds.length; i++, j++) {
        if(i === 0 || j === Object.keys(ths).length) {
            z++;
            j = 0;
            expect(tds[i].innerHTML).toBe(z.toString());
        } else {
            expect(tds[i].innerHTML).toBe(Object.values(employee)[j - 1]);
        }
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
