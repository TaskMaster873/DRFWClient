import React from "react";
import {FormErrorType} from "../messages/FormMessages";

class InternalFormUtils {
    public validateForm(event: React.FormEvent<HTMLFormElement>) {
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

export const FormUtils = new InternalFormUtils();
