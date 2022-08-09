import {Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards} from '@nestjs/common'
import {Request, Response} from 'express'
import {AuthService} from './auth.service'
import {SignInDto, SignUpDto} from './dto'
import {jwtRefreshKey} from '@constants/common'
import {RefreshTokenGuard} from '@guards/refresh-token.guard'
import {PublicRoute} from '@decorators/public.decorator'
import {GetCurrentUser} from '@decorators/current-user.decorator'
import {UserDto} from '@/user/dto'

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {
    }

    @PublicRoute()
    @Post('signUp')
    async signUp(@Body() body: SignUpDto, @Res({passthrough: true}) response: Response): Promise<{ accessToken: string }> {
        const {accessToken, refreshToken} = await this.authService.signUp(body)
        response.cookie(jwtRefreshKey, refreshToken, {httpOnly: true})
        return {accessToken}
    }

    @PublicRoute()
    @Post('signIn')
    async signIn(@Body() body: SignInDto, @Res({passthrough: true}) response: Response): Promise<{ accessToken: string }> {
        const {accessToken, refreshToken} = await this.authService.signIn(body)
        response.cookie(jwtRefreshKey, refreshToken, {httpOnly: true})
        return {accessToken}
    }

    @PublicRoute()
    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    async refresh(
        @GetCurrentUser() user: UserDto,
        @Body() body: SignInDto,
        @Req() request: Request,
        @Res({passthrough: true}) response: Response
    ): Promise<{ accessToken: string }> {
        const {accessToken, refreshToken} = await this.authService.refreshToken(user, request.cookies.jwt)
        response.cookie(jwtRefreshKey, refreshToken, {httpOnly: true})
        return {accessToken}
    }

    @UseGuards(RefreshTokenGuard)
    @Get('logout')
    @HttpCode(200)
    async logout(
        @GetCurrentUser('id') userId: string,
        @Req() request: Request,
        @Res({passthrough: true}) response: Response
    ): Promise<void> {
        await this.authService.logout(userId, request.cookies.jwt)
        response.clearCookie(jwtRefreshKey, null)
        response.send()
    }
}
