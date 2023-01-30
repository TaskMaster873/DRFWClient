import { Employee } from "./Employee";
import { Project } from "./Project";

export interface ShiftsList {
  shifts: Shift[];
}

export interface Shift {
  project: Project;
  text: string;
  resource: string;
  start: string;
  end: number;
  employe: Employee;
  readonly id: string;
}

export interface ShiftDTO {
  readonly text: string;
  readonly resource: string;
  readonly start: string;
  readonly end: number;
  readonly id: string;
  readonly project: Project;
  readonly employe: Employee;
}
