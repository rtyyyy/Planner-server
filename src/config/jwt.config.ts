import { JwtModuleOptions } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config'

//функция принимает configService => отдаёт JwtModuleOptions и в конце отдаёт JWT_SECRET
export const getJwtConfig = async (
    configService: ConfigService
): Promise<JwtModuleOptions> =>({
    secret: configService.get('JWT_SECRET'),
})