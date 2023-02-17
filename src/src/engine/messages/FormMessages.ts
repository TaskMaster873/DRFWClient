export enum FormErrorType {
    NO_ERROR = '0',
    INVALID_FORM = '1'
}

export const errors = {
    errorGenericMessage: "Erreur ",
    errorForm: "Il y a une erreur",
    errorLogout: "Erreur de déconnexion",
    requiredFirstName: "Le prénom est requis",
    requiredName: "Le nom est requis",
    requiredPassword: "Le mot de passe est requis",
    requiredOldPassword: "L'ancien mot de passe est requis",
    requiredRole: "Le rôle de l'employé est requis",
    requiredDepartmentName: "Le nom du département est requis",
    invalidEmail: "L'adresse courriel est invalide",
    invalidPhoneNumber: "Le numéro de téléphone est invalide",
    invalidInitialPassword: "Le mot de passe initial doit contenir un minimum de 6 caractères, une minuscule, une majuscule et un caractère spécial",
    invalidNewPassword: "Le nouveau mot de passe doit contenir un minimum de 6 caractères, une minuscule, une majuscule et un caractère spécial",
    invalidLogin: "Le numéro d'employé ou le mot de passe spécifié est invalide",
    departmentAlreadyExists: "Le département existe déjà",
    messageScheduleUnavailable: "l'horaire n'est pas disponible pour le moment, veuillez réessayer plus tard",
    serverError: "Une erreur s'est produite, veuillez réessayer plus tard",
    requiredDepartmentDirector: "Le directeur de département est requis",
    invalidActionCode: "L'hyperlien de réinitialisation de mot de passe est invalide ou expiré. Essayez à nouveau.",
    getDepartments: "Une erreur s'est produite lors de la récupération des données des départements",
    getEmployees: "Une erreur s'est produite lors de la récupération des données des employés"
}

export const successes = {
    successGenericMessage: "Succès",
    emailSent: "Un courriel a bien été envoyé !",
    employeeCreated: "Un nouvel employé a été ajouté avec succès !",
    departmentCreated: "Un nouveau département a été ajouté avec succès !",
    login: "Vous êtes maintenant connecté !",
    logout: "Vous êtes maintenant déconnecté !",
    changedPassword: "Le changement de mot de passe a bien été effectué !",
    resetPassword: "Le mot de passe a bien été mis à jour !",
    employeeDeactivated: "L'employé a bien été désactivé !"
}

export const info = {
    passwordReset: "Réinitialisation du mot de passe",
    emailSent: "Un courriel a été envoyé à votre adresse courriel.",

}