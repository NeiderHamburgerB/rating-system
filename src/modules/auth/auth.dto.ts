import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  email: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  password: string;
}
