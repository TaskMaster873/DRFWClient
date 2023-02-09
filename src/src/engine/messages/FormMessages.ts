export enum FormErrorType {
    NO_ERROR = '0',
    INVALID_FORM = '1'
}

export const errors = {
    errorRequiredFirstName: "Le prénom est requis",
    errorRequiredName: "Le nom est requis",
    errorRequiredPassword: "Le mot de passe est requis",
    errorRequiredOldPassword: "L'ancien mot de passe est requis",
    errorRequiredRole: "Le rôle de l'employé est requis",
    errorRequiredDepartmentName: "Le nom du département est requis",
    errorInvalidEmail: "L'adresse courriel est invalide",
    errorInvalidPhoneNumber: "Le numéro de téléphone est invalide",
    errorInvalidInitialPassword: "Le mot de passe initial doit contenir un minimum de 6 caractères, une minuscule, une majuscule et un caractère spécial",
    errorInvalidNewPassword: "Le nouveau mot de passe doit contenir un minimum de 6 caractères, une minuscule, une majuscule et un caractère spécial",
    errorInvalidLogin: "Le numéro d'employé ou le mot de passe spécifié est invalide",
    messageScheduleUnavailable: "l'horaire n'est pas disponible pour le moment, veuillez réessayer plus tard"
}

export const success = {
    emailSent: "Un courriel a bien été envoyé"
}