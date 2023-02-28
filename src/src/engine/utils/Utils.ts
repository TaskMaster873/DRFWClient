import React from "react";
import {FormErrorType} from "../messages/FormMessages";
import {IdElement} from "../types/Global";

class InternalUtils {
    editElement<T>(array: IdElement[], id: string, element: T): IdElement[] {
        let oldElem = array.find(elem => elem.id == id);
        if (oldElem) {
            let employeeIndex = array.findIndex(elem => elem.id == id);
            if (element && employeeIndex != -1) {
                array[employeeIndex] = element;
            }
        }
        return array;
    }

    deleteElement<T>(array: IdElement[], id: string, element: T): IdElement[] {
        let oldElem = array.find(elem => elem.id == id);
        if (oldElem) {
            let employeeIndex = array.findIndex(elem => elem.id == id);
            if (element && employeeIndex != -1) {
                array.splice(employeeIndex, 1);
            }
        }
        return array;
    }
}

export const Utils = new InternalUtils();
