import {
  IsEmail,
  IsEnum,
  Matches,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { UserRole } from '../user-role.enum';

export class CreateUserDto {
  @IsEmail()
  email!: string;

    @IsString()
    @MinLength(8)
    @Matches(/[A-Z]/,{
        message: 'Password must contain at least one uppercasse letter !'
    })
    @Matches(/[0-9]/,{
        message: 'Password must contain at least one number'
    })
    password!: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}