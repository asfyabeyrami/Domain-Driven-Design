import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsNumberString,
  IsInt,
  IsEnum,
  IsOptional,
} from 'class-validator';

// enum
import { Role } from '../eNums/role.enum';
import { Expose } from 'class-transformer';

// OBJ *******************

export function adminObj(admin, jwtToken = null) {
  return {
    id: admin.id,
    userName: admin.userName,
    jwtToken: jwtToken || null,
  };
}
export function adminFullObj(admin) {
  return {
    id: admin.id,
    userName: admin.userName,
    createdAt: admin.createdAt,
  };
}

export class LoginDto {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'نام شما اجباری می باشد' })
  userName: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'پسورد اجباری می باشد' })
  password: string;
}

export class RegistryDto {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'نام شما اجباری می باشد' })
  userName: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'پسورد اجباری می باشد' })
  password: string;
}

export class AdminDto {
  userName: string;
}
