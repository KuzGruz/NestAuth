import { CACHE_MANAGER, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { UserService } from '@/user/user.service'
import { SignInDto, SignUpDto } from './dto'
import { UserDto } from '@/user/dto'
import { UserEntity } from '@/user/user.entity'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { Tokens } from './dto/auth.type'
import { ConfigService } from '@nestjs/config'
import { convertToSeconds } from '@utils'

@Injectable()
export class AuthService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache,
                private readonly userService: UserService,
                private readonly configService: ConfigService,
                private readonly jwtService: JwtService) {
    }

    async signIn(body: SignInDto): Promise<Tokens> {
        const user = await this.getUser(body)
        return await this.generateJwt(user)
    }

    async signUp(body: SignUpDto): Promise<Tokens> {
        const existingUser = await this.userService.findByEmail(body.email)
        if (existingUser) {
            throw new NotFoundException('Email already exist')
        }
        if (body.password !== body.confirmPassword) {
            throw new NotFoundException('Passwords does not match')
        }
        delete body.confirmPassword
        body.password = await this.hashPassword(body.password)
        const newUser = await this.userService.add(body)
        return await this.generateJwt(newUser)
    }

    async cachedRefreshToken(userId: string | number, token: string): Promise<void> {
        const ttl = convertToSeconds(this.configService.get('JWT_REFRESH_EXPIRES'))
        await this.cacheManager.set(`user:${userId}:${token}`, Date.now(), {ttl})
    }

    async refreshToken(user: UserDto, refreshToken: string): Promise<Tokens> {
        const success = await this.deleteJwtFromCache(user.id, refreshToken)
        if (!user || !success) {
            throw new NotFoundException('Invalid refresh token')
        }
        return this.generateJwt(user)
    }

    async logout(id: string, refreshToken: string): Promise<void> {
        await this.deleteJwtFromCache(id, refreshToken)
    }

    private async getUser({email, password}: SignInDto): Promise<UserEntity | null> {
        const user = await this.userService.findByEmail(email)
        if (!user) {
            throw new NotFoundException('User doesn\'t found')
        }
        const correctPassword = await bcrypt.compare(password, user.password)
        if (!correctPassword) {
            throw new NotFoundException('Password is incorrect')
        }
        delete user.password
        return user
    }

    private async generateJwt(user: UserDto): Promise<Tokens> {
        const payload = {
            id: user.id,
            email: user.email
        }
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES')
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES')
            })
        ])
        await this.cachedRefreshToken(payload.id, refreshToken)
        return {accessToken, refreshToken}
    }

    private async deleteJwtFromCache(id: string, token: string): Promise<boolean> {
        const response = await this.cacheManager.del(`user:${id}:${token}`)
        return !!response
    }

    private hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10)
    }
}
