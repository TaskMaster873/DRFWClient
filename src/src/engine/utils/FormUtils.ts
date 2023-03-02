import React from "react";
import {FormErrorType} from "../messages/FormMessages";

/**
 * The InternalFormUtils is responsible for storing useful methods often used in component forms.
 * It is a singleton class, this allows us to have a single instance of the FormUtils and use it throughout the application.
 * @class FormUtils
 * @extends Logger
 */
export default class FormUtils {
    /**
     * This function validate the React form by checking if each element is valid
     * @description It will return the form errorType
     * @param event {React.FormEvent<HTMLFormElement>} The form event
     * @private
     * @memberof InternalFilterUtils
     */
    static validateForm(event: React.FormEvent<HTMLFormElement>) {
        const form = event.currentTarget;
        let isValid = form.checkValidity();

        event.preventDefault();
        event.stopPropagation();

        let errorType = FormErrorType.NO_ERROR;
        if (!isValid) {
            errorType = FormErrorType.INVALID_FORM;
        }

        return errorType;
    }
}
