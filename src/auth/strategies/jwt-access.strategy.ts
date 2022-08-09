import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { TokenPayload } from '../dto/auth.type'
import { jwtAccessStrategy } from '@constants/common'

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, jwtAccessStrategy) {
    constructor(private readonly config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_ACCESS_SECRET')
        })
    }

    async validate(payload: TokenPayload): Promise<TokenPayload> {
        return payload
    }
}
