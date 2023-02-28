export class JobTitle {
    public id?: string;
    public name: string;
    constructor(jobTitle: JobTitleDTO) {
        this.id = jobTitle.id;
        this.name = jobTitle.name;
    }
}

export interface JobTitleDTO {
    readonly id?: string;
    readonly name: string;
}

export interface JobTitleEditDTO {
    readonly name: string;
}
