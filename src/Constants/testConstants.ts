import {Department} from "../src/engine/types/Department";
import {Employee} from "../src/engine/types/Employee";

export const testConstants = {
    validEmail: "maxime_labbe@outlook.com",
    validFirstName: "Alfred",
    validName: "Montmagny",
    validPhoneNumber: "418-666-6666",
    validPassword: "Jf3$E12",
    invalidEmail: "a@a",
    invalidPhoneNumber: "41-92-006",
    invalidPassword: "44ab",
    validNewPassword: "U51hy&6"
};

export const testPopupConstant = {
    validRGBColor: "#6aa84f",
};

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

let departments : Department[] = [department];
let departments2 : Department[] = [department, department2];

let employeeNb : number[] = [1, 2];

export {employee, employee2, employees, employees2, department, department2, departments, departments2, employeeNb};


