import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe} from '@nestjs/common';
import { TimeBlockService } from './time-block.service';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TimeBlockDto } from './dto/time-block.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('user/time-blocks')
export class TimeBlockController {
  constructor(private readonly timeBlockService: TimeBlockService) {}
  // эндпоинт на получение всех тасок текущенго юзера
  @Get()
  @Auth()
  async getAll(@CurrentUser('id') userId:string){
    return this.timeBlockService.getAll(userId)
  }
  // создаём таску
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async create(@Body() dto:TimeBlockDto, @CurrentUser('id') userId:string){
    return this.timeBlockService.create(dto, userId)
  }
  //обновление порядка
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put('update-order')
  @Auth()
  async updateOrder(
    @Body() updateOrderDto: UpdateOrderDto){
    return this.timeBlockService.updateOrder(updateOrderDto.ids)
  }
 //обновление
 @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth()
  async update(
    @Body() dto: TimeBlockDto,
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ){
    return this.timeBlockService.update(dto, id, userId)
  }


  // удаление
  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async delete( @CurrentUser('id') userId: string, @Param('id') id: string){
    return this.timeBlockService.delete(id, userId)
  }
}
