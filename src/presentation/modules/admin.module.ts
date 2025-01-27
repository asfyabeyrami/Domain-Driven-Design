import { Module } from '@nestjs/common';
import { AdminService } from '../../domain/services/admin.srevice';
import { AdminDataAccess } from '../../domain/dataAccess/admin.dataAccess';
import { PermissionController } from '../controllers/permissions.controller';
import { Jwt } from '../../shared/helper/jwt.helper';

@Module({
  imports: [],
  controllers: [PermissionController],
  providers: [AdminService, AdminDataAccess, Jwt],
  exports: [AdminService],
})
export class AdminModule {}
