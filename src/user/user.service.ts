import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService ){}
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
}
//обращаемся в юзеру внутри призмы и получаем уникального юзера, делаем это по уникальному полю id и получаем всего юзера вместе с его тасками 