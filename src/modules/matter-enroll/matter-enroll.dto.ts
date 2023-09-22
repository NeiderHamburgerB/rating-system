import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID, IsNumber, IsOptional, IsEnum, IsIn } from "class-validator";
import { StatusMatter } from "src/common/enum/status-matter.enum";
import { StatusDefault } from "src/models/matter-enroll/matter-enroll.entity";

export class CreateMatterEnrollDto {
    
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    matter_id: string;
  
    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    student_id?: number;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    score?:number;

}

export class UpdateMatterEnrollDto {

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(StatusDefault)
    status?: string;

    @ApiPropertyOptional()
    @IsNumber()
    score?:number;

}

export class StatusMatterEnrollDto {
    @IsIn([StatusMatter.APROBADA, StatusMatter.PERDIDA, StatusMatter.TODO], { message: 'El estado debe ser APROBADA, PERDIDA o TODO' })
    status: StatusMatter;
}
