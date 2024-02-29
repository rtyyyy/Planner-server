import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { verify } from 'argon2';
import {Response} from 'express'
@Injectable()
export class AuthService {
    EXPIRE_DAY_REFRESH_TOKEN = 1
    REFRESH_TOKEN_NAME = 'refreshToken'

    constructor(
        private jwt: JwtService,
        private userService: UserService
    ){}
    async login(dto:AuthDto){
        //валидируем юзера
        const{password, ...user} = await this.validateUser(dto)
        //создаём токены
        const tokens =  this.issueTokens(user.id)
        return {
            user,
            ...tokens
        }
    }

    async register(dto:AuthDto){
        const oldUser = await this.userService.getByEmail(dto.email)
        //уникальность эмейла, один акк один эмейл
        if(oldUser) throw new BadRequestException('user already exist')
        // если такой пользователь уже есть то выкидывать ошибку
        const {password, ...user} = await this.userService.create(dto)
        // создём юзера
        const tokens =  this.issueTokens(user.id)
        return {
            user,
            ...tokens
        }
    }
    async getNewTokens(refreshToken: string){
        const result = await this.jwt.verifyAsync(refreshToken)//верифицируем токен 
        if(!result) throw new UnauthorizedException('Invalid refresh token')//если реза нет то он не валидный 
        const{password, ...user} = await this.userService.getById(result.id) // далее если всё ок то получаем юзера 
        const tokens =  this.issueTokens(user.id)//создаём новый токен
        return{
            user, 
            ...tokens,
        }
    }
    //генерим токен 
    private issueTokens(userId:string){
        const data = {id:userId}
        const accessToken = this.jwt.sign(data, {
            expiresIn: '1h'
        })
        const refreshToken = this.jwt.sign(data, {
            expiresIn: '7d'
        })
        return{accessToken, refreshToken}
    }
    private async validateUser(dto:AuthDto){
        const user = await this.userService.getByEmail(dto.email)
        //получили пользователя по эмейлу
        if (!user) throw new NotFoundException('User not found')
        // кидаеми ошибку если не нашли юзера
        const isValid = await verify(user.password, dto.password)
        //валидируем пароль который хранится в хеш виде
        if(!isValid) throw new UnauthorizedException('Invalid password')
        //если пароль невалидный кидаем ошибку
        return user
    }
    //добавляем куки
    addRefreshTokenResponse(res: Response, refreshToken:string){
        const expiresIn = new Date()
        //указываем дату окончания
        expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)
        //далее к этой дате добавляем определённую дату и к этому колву дней указываем колво дней окончания токена
        res.cookie(this.REFRESH_TOKEN_NAME, refreshToken,{
            httpOnly:true,
            domain:'localhost',
            expires: expiresIn,
            secure:true,
            sameSite: 'none'
        })
        //далее передаём название куков и то что в них будет храниться и её настройки
    }

    removeRefreshTokenResponse(res: Response){
        res.cookie(this.REFRESH_TOKEN_NAME, '',{
            httpOnly:true,
            domain:'localhost',
            expires: new Date(0),
            secure:true,
            sameSite: 'none'
        })
        //обнуляем куки
    }
}
   