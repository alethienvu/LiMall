import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/shares/enums/user.enum';

export class CreateAdminDto {
  @ApiProperty({
    required: true,
    example: 'admin@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    example: '123456@Abc',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: UserRole.ADMIN,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;
}
