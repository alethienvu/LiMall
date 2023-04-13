import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly address?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly first_name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly last_name?: string;
}
