import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AdminDataAccess } from '../dataAccess/admin.dataAccess';
import { AdminDto, adminObj } from 'src/application/DTO/admin.dto';
import { Jwt } from '../../shared/helper/jwt.helper';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminDataAccess: AdminDataAccess,
    private readonly jwt: Jwt,
  ) {}
  async create(userName: string, password: string): Promise<AdminDto> {
    const admin = await this.adminDataAccess.findByUserName(userName);
    if (admin) {
      throw new HttpException('تکراری', 404);
    }
    const hashedpass = await bcrypt.hash(password, 10);
    const newAdmin = await this.adminDataAccess.create(userName, hashedpass);
    return adminObj(newAdmin);
  }

  async loginUser(userName: string, password: string): Promise<AdminDto> {
    const admin = await this.adminDataAccess.findByUserName(userName);
    if (!admin) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'نام کاربری یا رمز عبور اشتباه است',
          message: 'LOGIN_FAILED',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const passCheck = await bcrypt.compare(password, admin.password);
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
      id: admin.id,
      role: admin.role,
    };
    const token = this.jwt.signer(tokenValues, 86400 * 2);
    await this.adminDataAccess.updateJwtToken(token, admin.id);
    return adminObj(admin, token);
  }

  async logout(adminId: number): Promise<boolean> {
    await this.adminDataAccess.logout(adminId);
    return true;
  }
}
