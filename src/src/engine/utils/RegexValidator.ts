/**
 * @file RegexValidator.ts
 * @description Regex validator for the application.
 * @author TaskMaster
 */

export namespace RegexUtil {
    export const goodPasswordRegex: string = `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$`;
    export const emailGoodRegex: string = `^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$`;
    export const phoneNumberRegex: string = `^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$`;
}
