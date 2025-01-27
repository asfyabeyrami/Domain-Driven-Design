import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { UserUseCase } from '../../application/use-case/user.use-case';
import { AdminUseCase } from '../../application/use-case/admin.use-case';
import {
  LoginUserDto,
  RegistryUserDto,
  UserDto,
} from '../../application/DTO/user.dto';
import { LoginDto, RegistryDto } from '../../application/DTO/admin.dto';
import { Public, Roles } from '../../shared/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../shared/decorators/userIdfromReq.decorators';
import { Role } from '../../application/eNums/role.enum';
import { Admin } from '../../shared/decorators/adminIdfromReq.decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userUseCase: UserUseCase,
    private readonly adminUseCase: AdminUseCase,
  ) {}

  // register user************************************************************
  @ApiOperation({
    summary: 'ثبت نام کاربر',
  })
  @ApiBody({
    type: RegistryUserDto,
    description: 'ثبت نام کاربر',
  })
  @ApiOkResponse({
    description: 'user login successful',
    type: UserDto,
  })
  @Public()
  @Post('registerUser')
  @HttpCode(HttpStatus.OK)
  async registerUser(@Body() payload: RegistryUserDto) {
    return await this.userUseCase.registerUser(payload);
  }

  // login user************************************************************
  @ApiOperation({
    summary: 'ورود کاربر',
  })
  @ApiBody({
    type: LoginUserDto,
    description: 'ورود کاربر',
  })
  @ApiOkResponse({
    description: 'user login successful',
    type: LoginUserDto,
  })
  @Public()
  @Post('loginUser')
  @HttpCode(HttpStatus.OK)
  async loginUser(@Body() payload: LoginUserDto) {
    return await this.userUseCase.loginUser(payload);
  }

  // logout user************************************************************
  @ApiOperation({
    summary: 'خروج کاربر',
  })
  @ApiOkResponse({
    description: 'user logout',
    type: Boolean,
  })
  @ApiBearerAuth()
  @Roles(Role.USER)
  @Post('logOutUser')
  @HttpCode(HttpStatus.OK)
  async logOut(@User('id') userId: number): Promise<boolean> {
    try {
      await this.userUseCase.logoutUser(userId);
    } catch (e) {
      Logger.error(e.massage);
    }
    return true;
  }

  // register admin************************************************************
  @ApiOperation({
    summary: 'ثبت نام ادمین',
  })
  @ApiBody({
    type: RegistryDto,
    description: 'ثبت نام ادمین',
  })
  @ApiOkResponse({
    description: 'admin login successful',
    type: RegistryDto,
  })
  @Public()
  @Post('registerAdmin')
  @HttpCode(HttpStatus.OK)
  async registerAdmin(@Body() payload: RegistryDto) {
    return await this.adminUseCase.registerAdmin(payload);
  }

  // login admin************************************************************
  @ApiOperation({
    summary: 'ورود ادمین',
  })
  @ApiBody({
    type: LoginDto,
    description: 'ورود ادمین',
  })
  @ApiOkResponse({
    description: 'admin login successful',
    type: LoginDto,
  })
  @Public()
  @Post('loginAdmin')
  async loginAdmin(@Body() payload: LoginDto) {
    return await this.adminUseCase.loginAdmin(payload);
  }

  // logout admin************************************************************
  @ApiOperation({
    summary: 'خروج ادمین',
  })
  @ApiOkResponse({
    description: 'admin logout',
    type: Boolean,
  })
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Post('logOutAdmin')
  async logOutAdmin(@Admin('id') adminId: number): Promise<boolean> {
    try {
      await this.adminUseCase.logoutAdmin(adminId);
    } catch (e) {
      Logger.error(e.massage);
    }
    return true;
  }
}
