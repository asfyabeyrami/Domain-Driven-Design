import { Injectable } from '@nestjs/common';
import { AdminService } from '../../domain/services/admin.srevice';
import { AdminDto, LoginDto, RegistryDto } from '../DTO/admin.dto';

@Injectable()
export class AdminUseCase {
  constructor(private readonly adminService: AdminService) {}

  async registerAdmin(payload: RegistryDto): Promise<AdminDto> {
    const { userName, password } = payload;
    return await this.adminService.create(userName, password);
  }

  async loginAdmin(payload: LoginDto): Promise<AdminDto> {
    const { userName, password } = payload;
    return await this.adminService.loginUser(userName, password);
  }

  async logoutAdmin(adminId: number): Promise<boolean> {
    return await this.adminService.logout(adminId);
  }
}
