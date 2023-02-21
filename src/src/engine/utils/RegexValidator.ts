/**
 * @file RegexValidator.ts
 * @description Regex validator for the application.
 * @author TaskMaster
 */

export namespace RegexUtil {
    export const goodPasswordRegex: string = `^.*(?=.{6,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!&$%@? "]).*$`;
    export const emailGoodRegex: string = `^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$`;
    export const phoneNumberRegex: string = `^(\+?1 ?)\(([0-9]{3})\)[-\. ]?([0-9]{3})[-\. ]?([0-9]{4})$`;
}
