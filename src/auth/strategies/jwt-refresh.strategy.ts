import { Request } from 'express'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { jwtRefreshKey, jwtRefreshStrategy } from '@constants/common'
import { TokenPayload } from '@/auth/dto/auth.type'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, jwtRefreshStrategy) {
    constructor(private readonly config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => req?.cookies ? req.cookies[jwtRefreshKey] : null]),
            ignoreExpiration: false,
            passReqToCallback: true,
            secretOrKey: config.get('JWT_REFRESH_SECRET')
        })
    }

    async validate(req: Request, payload: TokenPayload): Promise<TokenPayload> {
        return payload
    }
}
