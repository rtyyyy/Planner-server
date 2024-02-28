import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import {ExtractJwt, Strategy} from 'passport-jwt'
import { UserService } from "src/user/user.service";




@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private configService: ConfigService,
        private userService: UserService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: configService.get('JWT_SECRET'),
        })
    }
    async validate({id}: {id: string}){
        return this.userService.getById(id)
    }
}

//создаём класс jwtStrategy который является нашей 'стратегией' т.е. как будет происходить валидация нашего токена  который наследуется от PassportStrategy
//далее открываем конструктор и создаём 2 приватных аргумента, ConfigService - для того чтобы из .env достать токен и UserService - для декомпозиции логики 
// далее вызываем super и передаём все переменные внутри объекта  jwtFromRequest - откуда будем забирать jwt, ignoreExpiration - игнорируем все окончания токена, secretOrKey - указываем что ключ  по которому будет происходить шифрование будет находиться при помощи configService.get и jwtService
//далее указываем метод валидации в котором мы будем валидировать по нашему токену юзера (т.е. в этом токене лежат как данные так и шифрование - в данном токене данные это id ) мы расшифровываем токен и получаем userId дальше при помощи userService обращаемся и запрашиваем данные пользователя по его id