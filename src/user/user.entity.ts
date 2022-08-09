import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Gender, UserDto } from './dto/userDto'

@Entity()
export class UserEntity implements UserDto {

    @PrimaryGeneratedColumn('uuid') id: string

    @Column() email: string

    @Column() password: string

    @Column() firstName: string

    @Column() secondName: string

    @Column() gender: Gender

    @Column() birthday: Date
}
