import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    console.log('User from request:', user);

    if (data === 'id') {
      // اول adminId را چک می‌کنیم
      const id = user?.adminId || user?.id || user?.sub;
      console.log('Extracted ID:', id);

      if (!id) {
        throw new BadRequestException('شناسه کاربر یافت نشد');
      }

      // تبدیل به عدد اگر رشته است
      return typeof id === 'string' ? parseInt(id, 10) : id;
    }

    return data ? user?.[data] : user;
  },
);
