import {IdElement} from "../types/Global";

/**
 * The internalUtils is responsible for storing useful methods used in multiple components globally.
 * It is a static class, this allows us to have a single instance of the Utils and use it throughout the application.
 */
export default class Utils {
    /**
     * This method replace manually an element in an array with the one specified as a parameter
     * @param array the array of elements with an id
     * @param id the id of the element auto generated from the Firebase API
     * @param element the new element that replaces the current element in the array
     */
    static editElement<T>(array: IdElement[], id: string, element: T): IdElement[] {
        let oldElem = array.find(elem => elem.id == id);
        if (oldElem) {
            let employeeIndex = array.findIndex(elem => elem.id == id);
            if (element && employeeIndex != -1) {
                array[employeeIndex] = element;
            }
        }
        return array;
    }

    /**
     * This method deletes manually an element in an array
     * @param array the array of elements with an id
     * @param id the id of the element auto generated from the Firebase API
     */
    static deleteElement(array: IdElement[], id: string): IdElement[] {
        let oldElem = array.find(elem => elem.id == id);
        if (oldElem) {
            let employeeIndex = array.findIndex(elem => elem.id == id);
            if (employeeIndex != -1) {
                array.splice(employeeIndex, 1);
            }
        }
        return array;
    }
}
