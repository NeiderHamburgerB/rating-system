import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { CreateStudentDto, UpdateStudentDto } from './student.dto';
import { StudentsService } from './student.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import to from 'await-to-js';

@ApiTags('students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @ApiOperation({
    summary: 'Register Endpoint',
    description: 'Endpoint to register student.',
  })
  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    const [error, response] = await to(
      this.studentsService.create(createStudentDto),
    );
    if (error) {
      throw new BadRequestException(error);
    }

    return response;
  }

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @ApiOperation({
    summary: 'Get Endpoint',
    description: 'Endpoint to get one student.',
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const [error, response] = await to(
      this.studentsService.findOne({id}),
    );

    if (error) {
      throw new BadRequestException(error);
    }

    return response;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}
