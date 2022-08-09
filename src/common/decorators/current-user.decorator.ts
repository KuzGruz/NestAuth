import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { TokenPayload } from '@/auth/dto/auth.type'

export const GetCurrentUser = createParamDecorator(
    (data: keyof TokenPayload | undefined, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest()
        if (!data) return request.user
        return request.user[data]
    }
)
