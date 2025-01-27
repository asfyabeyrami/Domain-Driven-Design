import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export function userObj(user, jwtToken = null) {
  return {
    id: user.id,
    userName: user.userName,
    jwtToken: jwtToken || null,
  };
}

export class LoginUserDto {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'نام شما اجباری می باشد' })
  userName: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'پسورد اجباری می باشد' })
  password: string;
}

export class RegistryUserDto {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'نام شما اجباری می باشد' })
  userName: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'پسورد اجباری می باشد' })
  password: string;
}

export class UserDto {
  userName: string;
}
