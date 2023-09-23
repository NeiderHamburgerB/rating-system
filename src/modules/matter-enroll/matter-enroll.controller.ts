import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, BadRequestException, ValidationPipe } from '@nestjs/common';
import { MatterEnrollService } from './matter-enroll.service';
import { CreateMatterEnrollDto, StatusMatterEnrollDto, UpdateMatterEnrollDto } from './matter-enroll.dto';
import to from 'await-to-js';
import { Auth } from 'src/common/decorators/auth.decorators';
import { User } from 'src/common/decorators/user.decorators';
import { IStudent } from 'src/interfaces/IStudent.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/utils/pagination';

@ApiTags('matter-enroll')
@Controller('matter-enroll')
export class MatterEnrollController {
  constructor(private readonly matterEnrollService: MatterEnrollService) {}

  @Auth()
  @ApiOperation({
    summary: 'Create Endpoint (WITH AUTHENTICATION)',
    description: 'Endpoint to create matter enroll.',
  })
  @Post()
  async create(@Body() createMatterEnrollDto: CreateMatterEnrollDto, @User() user: IStudent) {
    
    createMatterEnrollDto.student_id = user.id;

    const [error, response] = await to(
      this.matterEnrollService.create(createMatterEnrollDto),
    );

    if (error) {
      throw new HttpException({
        message: error.message
      }, HttpStatus.BAD_REQUEST);
    }

    return response;

  }

  @Auth()
  @ApiOperation({
    summary: 'Get Endpoint (WITH AUTHENTICATION)',
    description: 'Endpoint to get all matter enrolled by student paginated.',
  })
  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto, @User() user: IStudent) {
    const [error, response] = await to(
      this.matterEnrollService.findAll(pageOptionsDto, user.id),
    );

    if (error) {
      throw new BadRequestException(error);
    }

    return response;

  }

  @Auth()
  @ApiOperation({
    summary: 'GET Endpoint, Check your Passed, Pending and Average Subjects (WITH AUTHENTICATION)',
    description: 'Here you can obtain your approved or missed subjects along with your average according to the search parameter sent (APROBADA, PERDIDA)',
  })
  @Get(':status')
  async findOne(@Param(ValidationPipe) statusDto: StatusMatterEnrollDto,@User() user: IStudent) {

    const [error, response] = await to(
      this.matterEnrollService.findAllByStudentId(statusDto, user.id),
    );

    if (error) {
      throw new BadRequestException(error);
    }

    return response;
  }

  @Auth()
  @ApiOperation({
    summary: 'Patch Endpoint (WITH AUTHENTICATION) passes the id of the matter enroll to be updated',
    description: 'It is enabled so that the student can finish a course taken and self-add a grade HAHA, it should only be permission from an administrator but since roles were not requested in the requirements.',
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMatterEnrollDto: UpdateMatterEnrollDto) {
    const [error, response] = await to(
      this.matterEnrollService.update(id,updateMatterEnrollDto),
    );
    if (error) {
      throw new BadRequestException(error);
    }

    return response;
  }

}
