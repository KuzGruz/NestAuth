import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { Repository } from 'typeorm'
import { UserDto } from './dto'

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {

    }

    async add(user: UserDto): Promise<UserDto> {
        const foundUser = await this.userRepository.save(user)
        delete foundUser.password
        return user
    }

    findAll(): Promise<UserDto[]> {
        return this.userRepository.find()
    }

    async findByEmail(email: string): Promise<UserEntity | undefined | null> {
        return await this.userRepository.findOne({where: {email}})
    }
}
