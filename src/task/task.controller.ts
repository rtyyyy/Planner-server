import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe} from '@nestjs/common';
import { TaskService } from './task.service';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TaskDto } from './task.dto';

@Controller('user/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  // эндпоинт на получение всех тасок текущенго юзера
  @Get()
  @Auth()
  async getAll(@CurrentUser('id') userId:string){
    return this.taskService.getAll(userId)
  }
  // создаём таску
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async create(@Body() dto:TaskDto, @CurrentUser('id') userId:string){
    return this.taskService.create(dto, userId)
  }
  //обновление
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth()
  async update(
    @Body() dto: TaskDto,
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ){
    return this.taskService.update(dto, id, userId)
  }
  // удаление
  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async delete( @Param('id') id: string){
    return this.taskService.delete(id)
  }
}
