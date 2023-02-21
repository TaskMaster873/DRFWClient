export enum FormErrorType {
    NO_ERROR = '0',
    INVALID_FORM = '1'
}

export const errors = {
    ERROR_GENERIC_MESSAGE: "Erreur ",
    ERROR_FORM: "Il y a une erreur",
    ERROR_LOGOUT: "Erreur de déconnexion",
    REQUIRED_FIRSTNAME: "Le prénom est requis",
    REQUIRED_NAME: "Le nom est requis",
    REQUIRED_PASSWORD: "Le mot de passe est requis",
    REQUIRED_OLD_PASSWORD: "L'ancien mot de passe est requis",
    REQUIRED_ROLE: "Le rôle de l'employé est requis",
    REQUIRED_DEPARTMENT_NAME: "Le nom du département est requis",
    INVALID_EMAIL: "L'adresse courriel est invalide",
    INVALID_PHONE_NUMBER: "Le numéro de téléphone est invalide",
    INVALID_INITIAL_PASSWORD: "Le mot de passe initial doit contenir un minimum de 6 caractères, une minuscule, une majuscule et un caractère spécial",
    INVALID_NEW_PASSWORD: "Le nouveau mot de passe doit contenir un minimum de 6 caractères, une minuscule, une majuscule et un caractère spécial",
    INVALID_LOGIN: "Le numéro d'employé ou le mot de passe spécifié est invalide",
    DEPARTMENT_ALREADY_EXIST: "Le département existe déjà",
    MESSAGE_SCHEDULE_UNAVALIBLE: "l'horaire n'est pas disponible pour le moment, veuillez réessayer plus tard",
    SERVER_ERROR: "Une erreur s'est produite, veuillez réessayer plus tard",
    REQUIRED_DEPARTMENT_DIRECTOR: "Le directeur de département est requis",
    INVALID_ACTION_CODE: "L'hyperlien de réinitialisation de mot de passe est invalide ou expiré. Essayez à nouveau.",
    GET_SHIFTS: "Une erreur s'est produite lors de la requête de votre horaire. Essayez à nouveau.",
    GET_DEPARTMENTS: "Une erreur s'est produite lors de la récupération des données des départements",
    GET_EMPLOYEES: "Une erreur s'est produite lors de la récupération des données des employés"
}

export const successes = {
    SUCCESS_GENERIC_MESSAGE: "Succès",
    EMAIL_SENT: "Un courriel a bien été envoyé !",
    EMPLOYEE_CREATED: "Un nouvel employé a été ajouté avec succès !",
    DEPARTMENT_CREATED: "Un nouveau département a été ajouté avec succès !",
    LOGIN_SUCCESS: "Vous êtes maintenant connecté !",
    LOGOUT_SUCCESS: "Vous êtes maintenant déconnecté !",
    CHANGE_PASSWORD: "Le changement de mot de passe a bien été effectué !",
    RESET_PASSWORD: "Le mot de passe a bien été mis à jour !",
    EMPLOYEE_DEACTIVATED: "L'employé a bien été désactivé !",
    EMPLOYEE_EDITED: `L'employé a bien été modifié !`,
}

export const info = {
    PASSWORD_RESET: "Réinitialisation du mot de passe",
    EMAIL_SENT: "Un courriel a été envoyé à votre adresse courriel."
}
