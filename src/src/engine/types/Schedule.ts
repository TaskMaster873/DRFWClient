export interface ScheduleGroups {
    groups: ScheduleGroup[];
}

export interface ScheduleGroup {
    name: string;
    id: string;
    resources: ScheduleResource[];
}

export interface ScheduleResource {
    name: string;
    id: string;
}

export interface ScheduleDTO {
    name: string;
    id: string;
    start: Date;
    end: Date;
    color: string;

}