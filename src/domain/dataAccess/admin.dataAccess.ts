import { Identifier } from 'sequelize';
import * as Models from '../Models/index';

export class AdminDataAccess {
  async create(userName: string, password: string): Promise<Models.Admin> {
    const admin = await Models.Admin.create({
      userName,
      password,
      role: 'admin',
    });
    return admin;
  }

  async createCharge(
    username: string,
    password: string,
    mobile: string,
    type: string,
    name: string,
    lastName: string,
    email: string,
    roleId: number,
  ): Promise<Models.Admin> {
    const admin = await Models.Admin.create({
      username,
      password,
      mobile,
      type,
      name,
      lastName,
      email,
      roleId,
    });
    return admin;
  }

  async findOne(id: number): Promise<Models.Admin> {
    return await Models.Admin.findOne({ where: { id } });
  }

  async findByUserName(userName: string): Promise<Models.Admin> {
    return await Models.Admin.findOne({ where: { userName } });
  }

  async findByEmail(email: string): Promise<Models.Admin> {
    const admin = await Models.Admin.findOne({
      where: {
        email,
      },
    });
    return admin;
  }
  async updateJwtToken(jwtToken: string, id: Identifier) {
    await Models.Admin.update(
      {
        jwtToken,
      },
      {
        where: {
          id,
        },
      },
    );
  }

  async logout(id: Identifier) {
    await Models.User.update(
      {
        jwtToken: null,
      },
      {
        where: {
          id,
        },
      },
    );
  }
  async updatePassword(id: Identifier, newPassword: string) {
    await Models.Admin.update(
      {
        password: newPassword,
      },
      {
        where: {
          id,
        },
      },
    );
  }
  async logOut(id: Identifier) {
    await Models.Admin.update(
      {
        jwtToken: null,
      },
      {
        where: {
          id,
        },
      },
    );
  }
}
