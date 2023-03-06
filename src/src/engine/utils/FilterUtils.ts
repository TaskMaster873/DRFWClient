import {Employee} from "../types/Employee";

class InternalFilterUtils {
    /**
     * This array contains the keys of the Employee object that we want to ignore
     */
    readonly ignoredElementsEmployee: string[] = [
        "isActive",
        "role",
        "skills",
        "jobTitles",
        "department",
    ];

    /**
     * This function filters a list of Employee objects based on a search term
     * @description It will return a list of Employee objects that have at least one property that starts with the search term
     * @description It will ignore the properties in the ignoredElementsEmployee array
     * @description It will ignore the properties that are not a string or a number
     * @param list {Employee[]} The list of Employee objects to filter
     * @param searchTerm {string} The search term
     * @returns {Employee[]} The filtered list of Employee objects
     * @private
     * @memberof InternalFilterUtils
     */
    public filterEmployeeList(list: Employee[], searchTerm: string): Employee[] {
        return list.filter((objectItem: Employee) => {
            let startWith = false;
            let keys: string[] = Object.keys(objectItem);

            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let value = objectItem[key];

                /**
                 * If the key is in the ignoredElementsEmployee array, we skip it
                 * If the value is not a string or a number, we skip it
                 */
                if (!(typeof (value) === "string" || typeof (value) === "number") || this.ignoredElementsEmployee.includes(key) || (typeof (value) !== "string" && typeof (value) !== "number")) {
                    continue;
                }

                /**
                 * If the value is a string or a number, we check if it starts with the search term
                 */
                if (value.toString().toLowerCase().startsWith(searchTerm.toLowerCase())) {
                    startWith = true;
                    break;
                }
            }

            return startWith;
        });
    }
}

/**
 * Singleton instance of the FilterUtils class
 */
export const FilterUtils = new InternalFilterUtils();
