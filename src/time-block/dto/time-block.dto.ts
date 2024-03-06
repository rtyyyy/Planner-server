import { Priority } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";


export class TimeBlockDto {
   @IsString()
   name:string

   @IsOptional()
   @IsString()
   color?: string

   @IsNumber()
   duration: number

   @IsNumber()
   @IsOptional()
   order: number
} 