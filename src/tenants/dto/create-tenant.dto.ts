import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTenantDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @Matches(/[a-zA-Z]/,{
    message: 'Name must have at least one letter !'
  })
  @IsString()
  @IsNotEmpty()
  name!: string;
}