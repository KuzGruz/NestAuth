import { AuthGuard } from '@nestjs/passport'
import { isPublicRoute, jwtAccessStrategy } from '@constants/common'
import { CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'

export class AccessTokenGuard extends AuthGuard(jwtAccessStrategy) implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = new Reflector().getAllAndOverride(isPublicRoute, [context.getHandler(), context.getClass()])
        if (isPublic) return true

        return super.canActivate(context)
    }
}
