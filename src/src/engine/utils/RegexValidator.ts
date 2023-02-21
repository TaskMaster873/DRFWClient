/**
 * @file RegexValidator.ts
 * @description Regex validator for the application.
 * @author TaskMaster
 */

export namespace RegexUtil {
    export const goodPasswordRegex: string = `^.*(?=.{6,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!&$%@? "]).*$`;
    export const emailGoodRegex: string = `^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$`;
    export const phoneNumberRegex: string = `1 \(\d{3}\)-\d{3}-\d{4}$`;
}
