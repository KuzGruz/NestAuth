import { Controller, Get } from '@nestjs/common'
import { UserService } from './user.service'
import { UserDto } from './dto'

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get()
    findAll(): Promise<UserDto[]> {
        return this.userService.findAll()
    }
}
