import { Module } from '@nestjs/common';
import { AuthService } from '../../domain/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../controllers/auth.controller';
import { UserDataAccess } from '../../domain/dataAccess/user.dataAccess';
import { AdminDataAccess } from '../../domain/dataAccess/admin.dataAccess';
import { UserService } from '../../domain/services/user.service';
import { AdminService } from '../../domain/services/admin.srevice';
import { UserUseCase } from '../../application/use-case/user.use-case';
import { AdminUseCase } from '../../application/use-case/admin.use-case';
import { Jwt } from '../../shared/helper/jwt.helper';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'serrhsauioybfub',
      signOptions: { expiresIn: '604800s' },
    }),
  ],
  providers: [
    AuthService,
    UserService,
    AdminService,
    UserDataAccess,
    AdminDataAccess,
    UserUseCase,
    AdminUseCase,
    Jwt,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
