import { AuthGuard } from '@nestjs/passport'
import { jwtRefreshKey, jwtRefreshStrategy } from '@constants/common'
import { CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'

export class RefreshTokenGuard extends AuthGuard(jwtRefreshStrategy) implements CanActivate {
    canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        return !!request.cookies[jwtRefreshKey] && super.canActivate(context)
    }
}
