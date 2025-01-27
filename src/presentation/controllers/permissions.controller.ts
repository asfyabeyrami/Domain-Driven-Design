import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '../../application/eNums/role.enum';
import { Admin } from '../../shared/decorators/adminIdfromReq.decorators';
import { Roles } from '../../shared/decorators/roles.decorator';
import { User } from '../../shared/decorators/userIdfromReq.decorators';

@ApiTags('Permission')
@Controller('Permission')
export class PermissionController {
  //  user************************************************************
  @ApiOperation({
    summary: 'کاربر',
  })
  @ApiBearerAuth()
  @Roles(Role.USER)
  @Post('user')
  @HttpCode(HttpStatus.OK)
  async userPermission(@User('id') userId: number) {
    return `user with id:${userId}`;
  }

  //  user************************************************************
  @ApiOperation({
    summary: 'ادمین',
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Post('admin')
  @HttpCode(HttpStatus.OK)
  async adminPermission(@Admin('id') adminId: number) {
    return `admin with id:${adminId}`;
  }
}
