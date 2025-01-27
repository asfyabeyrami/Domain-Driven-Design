import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDto, userObj } from '../../application/DTO/user.dto';
import { UserDataAccess } from '../dataAccess/user.dataAccess';
import * as bcrypt from 'bcrypt';
import { Jwt } from '../../shared/helper/jwt.helper';

@Injectable()
export class UserService {
  constructor(
    private readonly userDataAccess: UserDataAccess,
    private readonly jwt: Jwt,
  ) {}

  async create(userName: string, password: string): Promise<UserDto> {
    const user = await this.userDataAccess.findByUserName(userName);
    if (user) {
      throw new HttpException('تکراری', 404);
    }
    const hashedpass = await bcrypt.hash(password, 10);
    const newUser = await this.userDataAccess.create(userName, hashedpass);
    return userObj(newUser);
  }

  async loginUser(userName: string, password: string): Promise<UserDto> {
    const user = await this.userDataAccess.findByUserName(userName);
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'نام کاربری یا رمز عبور اشتباه است',
          message: 'LOGIN_FAILED',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const passCheck = await bcrypt.compare(password, user.password);
    if (!passCheck) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'نام کاربری یا رمز عبور اشتباه است',
          message: 'LOGIN_FAILED',
          statusCode: HttpStatus.UNAUTHORIZED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const tokenValues = {
      id: user.id,
      role: user.role,
    };
    const token = this.jwt.signer(tokenValues, 86400 * 2);
    await this.userDataAccess.updateJwtToken(token, user.id);
    return userObj(user, token);
  }

  async logout(userId: number): Promise<boolean> {
    await this.userDataAccess.logout(userId);
    return true;
  }
}
