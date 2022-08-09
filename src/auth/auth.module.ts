import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule } from '@/user/user.module'
import { ConfigModule } from '@nestjs/config'
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy'
import { JwtAccessStrategy } from './strategies/jwt-access.strategy'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { CacheManagerModule } from '@/cache-manager/cache-manager.module'

@Module({
    imports: [
        ConfigModule,
        UserModule,
        PassportModule,
        JwtModule.register({}),
        CacheManagerModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtRefreshStrategy, JwtAccessStrategy]
})
export class AuthModule {
}
