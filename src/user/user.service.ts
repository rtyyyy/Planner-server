import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService ){}
  //обращаемся в юзеру внутри призмы и получаем уникального юзера, делаем это по уникальному полю id и получаем всего юзера вместе с его тасками 
  getById(id: string){
    return this.prisma.user.findUnique({
      where: {
        id
      },
      include:{
        tasks: true
      }
    })
  }
  getByEmail(email:string){
    return this.prisma.user.findUnique({
      where: {
        email
      }
    })
  }
  async create(dto:AuthDto){
    //описываем юзера, хешируем пароль
    const user = {
      email: dto.email,
      name: '',
      password: await hash(dto.password),
    }
    //создаём юзера на основе того как его описали
    return this.prisma.user.create({
      data:user,
    })
  }
}
