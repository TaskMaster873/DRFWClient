import {Department} from "../src/engine/types/Department";
import {Employee} from "../src/engine/types/Employee";

export const testConstants = {
    validEmail: "maxime_labbe@outlook.com",
    validFirstName: "Alfred",
    validName: "Montmagny",
    validPhoneNumber: "418-666-6666",
    validPassword: "HWDIj23iew!",
    invalidEmail: "a@a",
    invalidPhoneNumber: "41-92-006",
    invalidPassword: "44ab",
    validNewPassword: "HWDIj23ie1w!",
    validStartDate: "2022-09-10T10:30:00",
    validEndDate: "2022-09-10T12:30:00",
    invalidDate: "2022-09-10T10:29:23",
    validId: "1"
};

export const testPopupConstant = {
    validRGBColor: "#6aa84f",
};

const employee = new Employee({
    firstName: "George",
    lastName: "Belleau",
    email: "georgeBelleau@gmail.com",
    phoneNumber: "418-532-5323",
    department: "Construction",
    isActive: true,
    jobTitles: ["Manager"],
    skills: ["Gestion de personnel"],
    role: 1,
    hasChangedDefaultPassword: true
});

const employee2 = new Employee({
    firstName: "Mathieu",
    lastName: "Bédard",
    email: "mathieubedard@gmail.com",
    isActive: true,
    phoneNumber: "418-325-2222",
    department: "Informatique",
    jobTitles: [],
    skills: [],
    role: 2,
    hasChangedDefaultPassword: true
});

const employeeWithId = new Employee({
    employeeId: "123",
    firstName: "David",
    lastName: "Gol",
    email: "test@test.test",
    isActive: true,
    phoneNumber: "977-333-2954",
    department: "Marketing",
    jobTitles: [],
    skills: [],
    role: 1,
    hasChangedDefaultPassword: true
});

const employeeWithId2 = new Employee({
    employeeId: "1234",
    firstName: "John",
    lastName: "Trenta",
    email: "jtrenta@hotmail.com",
    isActive: true,
    phoneNumber: "976-433-1062",
    department: "Marketing",
    jobTitles: ["Manager"],
    skills: ["Gestion de personnel"],
    role: 1,
    hasChangedDefaultPassword: true
});

const employees = [employee];
const employees2 = [employee, employee2];
const employeesWithIds = [employeeWithId];

const department = new Department({
    name: "Informatique", director: "Jasmin"
});

const department2 = new Department({
    name: "Informatique", director: "Jasmin"
});

const departments: Department[] = [department];
const departments2: Department[] = [department, department2];

const employeeNb: number[] = [1, 2];

export {employee, employee2, employeeWithId, employeeWithId2, employees, employees2, employeesWithIds, department, department2, departments, departments2, employeeNb};


