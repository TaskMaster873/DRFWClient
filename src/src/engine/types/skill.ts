export class Skill {
    public id?: string;
    public name: string;
    constructor(skill: skillDTO) {
        this.id = skill.id;
        this.name = skill.name;
    }
}

export interface skillDTO {
    readonly id?: string;
    readonly name: string;
}

export interface skillEditDTO {
    readonly name: string;
}
