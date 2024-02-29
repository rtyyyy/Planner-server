import { Body, Controller, HttpCode, Post, Res, UsePipes, ValidationPipe, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response,  Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto, @Res({passthrough:true}) res: Response){
   const {refreshToken, ...response} = await this.authService.login(dto)
   this.authService.addRefreshTokenResponse(res, refreshToken)

    return response
  }
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(@Body() dto: AuthDto, @Res({passthrough:true}) res: Response){
    const {refreshToken, ...response} = await  this.authService.register(dto)

    this.authService.addRefreshTokenResponse(res, refreshToken)
    return response
  }
  @HttpCode(200)
  @Post('login/access-token')
  async getNewTokens(
    @Req() req: Request,
    @Res({passthrough:true}) res: Response
  ){
      const refreshTokenFromCookies = req.cookies[this.authService.REFRESH_TOKEN_NAME] //получаем куки смотрим есть ли в них REFRESH_TOKEN_NAME

      if(!refreshTokenFromCookies){
        this.authService.removeRefreshTokenResponse(res)
        throw new UnauthorizedException('refresh token not passed')
      }//если его нет, то мы его очищаем и выдаём ошибку
      const {refreshToken, ...response} = await this.authService.getNewTokens(
        refreshTokenFromCookies
      )// если он есть, то с помощью рефреша его обновляем 
      this.authService.addRefreshTokenResponse(res , refreshToken)//дальше добавляем новый токен в запросе

      return response
    }
  


  @HttpCode(200)
  @Post('logout')
  async logout(@Res({passthrough:true}) res:Response){
    this.authService.removeRefreshTokenResponse(res)
    return true
  }
}
