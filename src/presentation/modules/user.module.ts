import { Module } from '@nestjs/common';
import { UserService } from '../../domain/services/user.service';
import { UserDataAccess } from '../../domain/dataAccess/user.dataAccess';
import { PermissionController } from '../controllers/permissions.controller';
import { Jwt } from 'src/shared/helper/jwt.helper';

@Module({
  imports: [],
  controllers: [PermissionController],
  providers: [UserService, UserDataAccess, Jwt],
  exports: [UserService],
})
export class UserModule {}
