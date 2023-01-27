export interface JobTitleList {
    list: JobTitle[];

}

export class JobTitle {
    name: string = "";

    public toString(): string {
        return name + ', ';
    }
}