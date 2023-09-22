import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateMatterDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  requirements?: CreateMatterDto[];

}

export class UpdateMatterDto extends PartialType(CreateMatterDto) {}