import { Controller, Get, Post, Body, Patch, Param, BadRequestException, Query, HttpException, HttpStatus } from '@nestjs/common';
import { MatterService } from './matter.service';
import { CreateMatterDto, UpdateMatterDto } from './matter.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import to from 'await-to-js';
import { PageOptionsDto } from 'src/common/utils/pagination';

@ApiTags('matter')
@Controller('matter')
export class MatterController {
  constructor(private readonly matterService: MatterService) {}

  @ApiOperation({
    summary: 'Create Endpoint (WITHOUT AUTHENTICATION)',
    description: 'Endpoint to create matter.',
  })
  @Post()
  async create(@Body() createMatterDto: CreateMatterDto) {
    
    const [error, response] = await to(
      this.matterService.create(createMatterDto),
    );

    if (error) {
      throw new HttpException({
        message: error.message
      }, HttpStatus.BAD_REQUEST);
    }

    return response;

  }

  @ApiOperation({
    summary: 'Get Endpoint (WITHOUT AUTHENTICATION)',
    description: 'Endpoint to get all matter paginated.',
  })
  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    const [error, response] = await to(
      this.matterService.findAll(pageOptionsDto),
    );

    if (error) {
      throw new BadRequestException(error);
    }

    return response;

  }

  @ApiOperation({
    summary: 'Get Endpoint (WITHOUT AUTHENTICATION)',
    description: 'Endpoint to get one matter.',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const [error, response] = await to(
      this.matterService.findOne(id),
    );

    if (error) {
      throw new BadRequestException(error);
    }

    return response;
  }

  @ApiOperation({
    summary: 'PATCH Endpoint (WITHOUT AUTHENTICATION)',
    description: 'Endpoint to update name or add required subjects',
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMatterDto: UpdateMatterDto) {
    const [error, response] = await to(
      this.matterService.update(id,updateMatterDto),
    );
    if (error) {
      throw new BadRequestException(error);
    }

    return response;
  }

}
