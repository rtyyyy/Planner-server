import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { TimeBlockDto } from './dto/time-block.dto';

@Injectable()
export class TimeBlockService {
  constructor(private prisma: PrismaService ){}
  // получаем все таски текущего пользователя 
  async getAll(userId: string){
    return this.prisma.timeBlock.findMany({
        where:{
            userId,
        },
        orderBy:{
            order:'asc'
        }
    })
  }
  //создаём задачу. Прикидываем dto, и при помощи connect подключаем юзера согласно схеме из призмы
  async create(dto: TimeBlockDto, userId: string){
    return this.prisma.timeBlock.create({
        data:{
            ...dto,
            user:{
                connect:{
                    id:userId
                }
            }
        }
    })
  }
    //
  async update(dto:Partial<TimeBlockDto>,timeBlockId: string, userId: string){
    return this.prisma.timeBlock.update({
        where:{
            userId,
            id: timeBlockId
        },
        data: dto
    })
  }
  async delete(timeBlockId:string, userId:string){
    return this.prisma.timeBlock.delete({
        where:{
            id:timeBlockId,
            userId
        }
    })
  }
//пробегаемся по каждому id, на каждой итерации обращаемся к бд и выстраиваем правильный порядок
  async updateOrder(ids:string[]){
    return this.prisma.$transaction(
        ids.map((id, order)=> this.prisma.timeBlock.update({
            where: {id},
            data:{order}
        }))
    )
  }
}
