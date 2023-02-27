import {Employee} from "../types/Employee";

class InternalFilterUtils {
    /**
     * This array contains the keys of the Employee object that we want to ignore
     */
    readonly ignoredElementsEmployee: string[] = [
        'isActive',
        'role',
        'skills',
        'jobTitles'
    ];

    public filterEmployee(list: Employee[], searchTerm: string) : Employee[] {
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
                if(!(typeof(value) === 'string' || typeof(value) === 'number') || this.ignoredElementsEmployee.includes(key) || (typeof(value) !== 'string' && typeof(value) !== 'number')) {
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

export const FilterUtils = new InternalFilterUtils();
