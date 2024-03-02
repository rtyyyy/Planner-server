import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { TaskDto } from './task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService ){}
  // получаем все таски текущего пользователя 
  async getAll(userId: string){
    return this.prisma.task.findMany({
        where:{
            userId
        }
    })
  }
  //создаём задачу. Прикидываем dto, и при помощи connect подключаем юзера согласно схеме из призмы
  async create(dto: TaskDto, userId: string){
    return this.prisma.task.create({
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
  async update(dto:Partial<TaskDto>,taskId: string, userId: string){
    return this.prisma.task.update({
        where:{
            userId,
            id: taskId
        },
        data: dto
    })
  }
  async delete(taskId:string){
    return this.prisma.task.delete({
        where:{
            id:taskId,
        }
    })
  }
}
