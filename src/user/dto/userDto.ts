export enum Gender {
    Male = 'male',
    Female = 'male'
}

export class UserDto {
    id: string
    email: string
    password: string
    firstName: string
    secondName: string
    gender: Gender
    birthday: Date
}
