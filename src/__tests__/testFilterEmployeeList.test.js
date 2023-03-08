import {FilterUtils} from '../src/engine/utils/FilterUtils';
import {employees2} from "../Constants/testConstants";
import {Employee} from "../src/engine/types/Employee";

describe('Test FilterUtil Class', () => {
    test('Test if filterEmployeeList can filter an empty list', () => {
        const FAKE_EMPTY_EMPLOYEE_LIST = [];

        const filteredList = FilterUtils.filterEmployeeList(FAKE_EMPTY_EMPLOYEE_LIST, "");

        expect(filteredList).not.toBeNull();
        expect(filteredList).toHaveLength(0);
    });

    test('Test if filterEmployeeList returns the same list of employee when is greater than 1 employee and search term is empty', () => {
        const filteredList = FilterUtils.filterEmployeeList(employees2, "");

        expect(filteredList).not.toBeNull();
        expect(filteredList.length).toBeGreaterThanOrEqual(employees2.length);
    });

    test('Test if filterEmployeeList returns the correct filtered list when is greater than 1 employee and search term equals to a valid parameter of at least one employee', () => {
        const selectedEmployee = employees2[0];
        const SEARCH_TERM_OF_AN_EMPLOYEE = selectedEmployee.firstName;
        const filteredList = FilterUtils.filterEmployeeList(employees2, SEARCH_TERM_OF_AN_EMPLOYEE);

        expect(filteredList).not.toBeNull();
        expect(filteredList).toHaveLength(1);
        expect(filteredList[0]).toBe(selectedEmployee);
    });

    test('Test if filterEmployeeList returns the correct filtered list when is greater than 1 employee and search term equals to a partial parameter of at least one employee', () => {
        const selectedEmployee = employees2[0];
        const SEARCH_TERM_OF_AN_EMPLOYEE = selectedEmployee.firstName.substring(0, 5);
        const filteredList = FilterUtils.filterEmployeeList(employees2, SEARCH_TERM_OF_AN_EMPLOYEE);

        expect(filteredList).not.toBeNull();
        expect(filteredList).toHaveLength(1);
        expect(filteredList[0]).toBe(selectedEmployee);
    });

    test('Test if filterEmployeeList returns the correct filtered list when filtering by partial email address', () => {
        const selectedEmployee = employees2[0];
        const SEARCH_TERM_OF_AN_EMPLOYEE = selectedEmployee.email.substring(0, 10);
        const filteredList = FilterUtils.filterEmployeeList(employees2, SEARCH_TERM_OF_AN_EMPLOYEE);

        expect(filteredList).not.toBeNull();
        expect(filteredList).toHaveLength(1);
        expect(filteredList[0]).toBe(selectedEmployee);
    });

    test('Test if filterEmployeeList returns the correct filtered list when filtering by partial phone number', () => {
        const selectedEmployee = employees2[0];
        const SEARCH_TERM_OF_AN_EMPLOYEE = selectedEmployee.phoneNumber.substring(0, 8);
        const filteredList = FilterUtils.filterEmployeeList(employees2, SEARCH_TERM_OF_AN_EMPLOYEE);

        expect(filteredList).not.toBeNull();
        expect(filteredList).toHaveLength(1);
        expect(filteredList[0]).toBe(selectedEmployee);
    });

    test('Test if filterEmployeeList returns the correct filtered list when filtering by first name', () => {
        const selectedEmployee = employees2[0];
        const SEARCH_TERM_OF_AN_EMPLOYEE = selectedEmployee.firstName.substring(0, 8);
        const filteredList = FilterUtils.filterEmployeeList(employees2, SEARCH_TERM_OF_AN_EMPLOYEE);

        expect(filteredList).not.toBeNull();
        expect(filteredList).toHaveLength(1);
        expect(filteredList[0]).toBe(selectedEmployee);
    });

    test('Test if filterEmployeeList returns the correct filtered list when filtering by last name', () => {
        const selectedEmployee = employees2[0];
        const SEARCH_TERM_OF_AN_EMPLOYEE = selectedEmployee.lastName.substring(0, 8);
        const filteredList = FilterUtils.filterEmployeeList(employees2, SEARCH_TERM_OF_AN_EMPLOYEE);

        expect(filteredList).not.toBeNull();
        expect(filteredList).toHaveLength(1);
        expect(filteredList[0]).toBe(selectedEmployee);
    });

    test('Test if filterEmployeeList does not test non string or number property', () => {
        const SEARCH_TERM_OF_AN_EMPLOYEE = 'true';
        const filteredList = FilterUtils.filterEmployeeList(employees2, SEARCH_TERM_OF_AN_EMPLOYEE);

        expect(filteredList).not.toBeNull();
        expect(filteredList).toHaveLength(0);
    });

    test('Test if filterEmployeeList returns the correct filtered list when is greater than 1 employee and search term equals to multiple employees', () => {
        const COMMON_SEARCH_TERM = "Bulle";

        const EMPLOYEE_A = new Employee({
            firstName: "George",
            lastName: COMMON_SEARCH_TERM,
            email: "georgeBelleau@gmail.com",
            phoneNumber: "418-532-5323",
            department: "Construction",
            isActive: true,
            jobTitles: [],
            skills: [],
            role: 1,
        });

        let EMPLOYEE_B = new Employee({
            firstName: "Mathieu",
            lastName: COMMON_SEARCH_TERM,
            email: "mathieubedard@gmail.com",
            isActive: true,
            phoneNumber: "418-325-2222",
            department: "Informatique",
            jobTitles: [],
            skills: [],
            role: 2,
        });

        const SAME_EMPLOYEE_PROPERTY = [EMPLOYEE_A, EMPLOYEE_B];

        const SEARCH_TERM_OF_MULTIPLE_EMPLOYEE = EMPLOYEE_A.lastName.substring(0, 5);
        const filteredList = FilterUtils.filterEmployeeList(SAME_EMPLOYEE_PROPERTY, SEARCH_TERM_OF_MULTIPLE_EMPLOYEE);

        expect(filteredList).not.toBeNull();
        expect(filteredList).toHaveLength(2);
    });
});
