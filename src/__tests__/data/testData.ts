import {Department} from "../../src/engine/types/Department";
import {Employee} from "../../src/engine/types/Employee";

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

let employee2 = new Employee({
    firstName: "Mathieu",
    lastName: "Bédard",
    email: "mathieubedard@gmail.com",
    phoneNumber: "418-325-2222",
    department: "Informatique",
    jobTitles: [],
    skills: [],
    role: 2,
})
let employees = [employee]
let employees2 = [employee, employee2]

let department = new Department({
    name: "Informatique", director: "Jasmin"
})

let department2 = new Department({
    name: "Informatique", director: "Jasmin"
})

let departments = [department];
let departments2 = [department, department2];

let employeeNb = [1, 2]

export {employee, employee2, employees, employees2, department, department2, departments, departments2, employeeNb};