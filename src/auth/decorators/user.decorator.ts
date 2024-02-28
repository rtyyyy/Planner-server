import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import type { User } from "@prisma/client";


export const CurrentUser = createParamDecorator(
    (data: keyof User, ctx:ExecutionContext)=>{
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        return data ? user[data] : user;
    }
)

// создаём декоратор при поомощи createParamDecorator далее получаем data и ctx(текущий контекст), из контекста забираем запрос и из запроса вытаскиваем юзера 