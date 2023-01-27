export interface JobTitleList {
    titles: JobTitle[];
}

export class JobTitle {
    name: string = "";

    public toString(): string {
        return name + ', ';
    }
}