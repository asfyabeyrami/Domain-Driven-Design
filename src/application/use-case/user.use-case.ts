import { Injectable } from '@nestjs/common';
import { UserService } from '../../domain/services/user.service';
import { LoginUserDto, RegistryUserDto, UserDto } from '../DTO/user.dto';

@Injectable()
export class UserUseCase {
  constructor(private readonly userService: UserService) {}

  async registerUser(payload: RegistryUserDto): Promise<UserDto> {
    const { userName, password } = payload;
    return await this.userService.create(userName, password);
  }

  async loginUser(payload: LoginUserDto): Promise<UserDto> {
    const { userName, password } = payload;
    return await this.userService.loginUser(userName, password);
  }

  async logoutUser(adminId: number): Promise<boolean> {
    return await this.userService.logout(adminId);
  }
}
