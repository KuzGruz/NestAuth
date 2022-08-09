import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { APP_GUARD, Reflector } from '@nestjs/core'
import { AccessTokenGuard } from '@guards/access-token.guard'

@Module({
    imports: [
        ConfigModule.forRoot(),
        DatabaseModule,
        UserModule,
        AuthModule
    ],
    controllers: [AppController],
    providers: [
        AppService,
        Reflector,
        {
            provide: APP_GUARD,
            useClass: AccessTokenGuard
        }
    ]
})
export class AppModule {
}
