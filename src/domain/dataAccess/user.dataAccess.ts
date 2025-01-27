import { Identifier, where } from 'sequelize';
import * as Models from '../Models/index';

export class UserDataAccess {
  async findOne(id) {
    try {
      const result = await Models.User.findOne({
        where: { id: id },
      });
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async findPk(id: number): Promise<Models.User> {
    const result = await Models.User.findByPk(id);
    return result;
  }
  async findOneNational(nCode: number): Promise<Models.User> {
    const result = await Models.User.findOne({ where: { nCode } });
    return result;
  }

  async count(): Promise<number> {
    const result = await Models.User.count();
    return result;
  }

  async findByPhone(phone): Promise<Models.User> {
    const result = await Models.User.findOne({
      where: { mobile: phone },
    });
    return result;
  }

  async findByNational(nCode): Promise<Models.User> {
    try {
      const result = await Models.User.findOne({
        where: { nCode: nCode },
      });
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async findByNationalOrigin(nCode): Promise<Models.User> {
    const result = await Models.User.findOne({
      where: {
        nCode,
      },
    });
    return result;
  }

  async create(userName: string, password: string): Promise<Models.User> {
    const result = await Models.User.create({
      userName,
      password,
      role: 'user',
    });
    return result;
  }

  async updateJwtToken(jwtToken: string, id: Identifier) {
    await Models.User.update(
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

  async findByUserName(userName: string): Promise<Models.User> {
    return await Models.User.findOne({ where: { userName } });
  }

  async createUser(mobile: number): Promise<Models.User> {
    const result = await Models.User.create({
      mobile,
      status: 2,
    });
    return result;
  }

  async list(page, pageSize) {
    const limit = parseInt(pageSize) || 12;
    const offset = parseInt(page) * limit || 0;
    const result = await Models.User.findAll({
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: offset,
    });

    return result;
  }

  async status(id, status) {
    await Models.User.update(
      {
        status,
        updatedAt: new Date(),
      },
      { where: { id } },
    );
  }

  async update(userId, avatarMediaId) {
    const result = await Models.User.update(
      {
        avatarMediaId,
      },
      {
        where: { id: userId },
      },
    );
    return result;
  }

  async registerComplete(
    userId: number,
    name: string,
    lastName: string,
  ): Promise<boolean> {
    await Models.User.update(
      {
        name,
        lastName,
      },
      { where: { id: userId } },
    );
    return true;
  }
}
