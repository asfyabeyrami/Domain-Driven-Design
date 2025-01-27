import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

export const Admin = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const admin = request.user;
    console.log('Admin from request:', admin);

    if (data === 'id') {
      const id = admin?.id;
      console.log('Admin ID:', id);

      if (!id) {
        throw new BadRequestException('شناسه ادمین یافت نشد');
      }

      return typeof id === 'string' ? parseInt(id, 10) : id;
    }

    return data ? admin?.[data] : admin;
  },
);
