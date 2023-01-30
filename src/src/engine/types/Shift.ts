import { Project } from "./Project";

export interface ShiftsList {
    shifts: Shift[];
}

export interface Shift {
    start: string;
    project: Project;
}