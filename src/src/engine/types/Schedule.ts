export interface ScheduleGroup {
    name: string;
    id: string;
    resources: ScheduleResource[];
}

export interface ScheduleResource {
    name: string;
    id: string;
}
