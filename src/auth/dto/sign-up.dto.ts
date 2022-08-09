import { UserDto } from '@/user/dto'

export class SignUpDto extends UserDto {
    confirmPassword: string
}
