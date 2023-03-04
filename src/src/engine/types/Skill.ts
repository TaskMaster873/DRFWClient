export class Skill {
    public id?: string;
    public name: string;
    constructor(skill: SkillDTO) {
        this.id = skill.id;
        this.name = skill.name;
    }
}

export interface SkillDTO {
    readonly id?: string;
    readonly name: string;
}
