import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/utils/pagination';
import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMatterDto, UpdateMatterDto } from './matter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Matter } from 'src/models/matter/matter.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import to from 'await-to-js';

@Injectable()
export class MatterService {

  constructor(
    private dataSource: DataSource,
    @InjectRepository(Matter)
    private matterRepository: Repository<Matter>,
  ){}

  async create(createMatterDto: CreateMatterDto) {
   
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create matter
      const [errorMatter, matter] = await to<Matter>(
        this.createMatter(
          queryRunner.manager,
          createMatterDto
        ),
      );

      if (errorMatter) {
        throw new BadRequestException(errorMatter.message);
      }

      await queryRunner.commitTransaction();

      return matter;

    } catch (error: Error | any) {
      
      await queryRunner.rollbackTransaction();
      // Internal Error
      throw error;

    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
 
  }

  private async createMatter(
    entityManager: EntityManager,
    matterInfo: CreateMatterDto,
  ){

    //Creating matter
    const [errorExist, exists] = await to(
      entityManager.findOne(Matter, {
        where: {
          name: matterInfo.name,
        },
        select: ['id'],
      }),
    );

    if (errorExist) {
      throw new InternalServerErrorException(errorExist);
    }

    if (exists) {
      throw new HttpException({
        message: 'La materia que intenta registrar ya existe'
      }, HttpStatus.BAD_REQUEST);
    }

    const matter = entityManager.create<Matter>(Matter, matterInfo);
   
    const [errorMatter, newMatter] = await to(entityManager.save(Matter, matter));

    if (errorMatter) {
      throw new HttpException({
        message: errorMatter
      }, HttpStatus.BAD_REQUEST);
    }

    return newMatter;

  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Matter>> {
    
    const queryBuilder = this.matterRepository.createQueryBuilder('matter');

    queryBuilder
      .leftJoinAndSelect(
        'matter.requirements',
        'requirements',
      )
      .orderBy('matter.created_at', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const total = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);

  }

  async findOne(id: string) {
    const [error, matter] = await to(
      this.matterRepository.findOne({
        where: {id},
        relations:['requirements']
      }),
    );

    if (error) {
      throw new BadRequestException(error);
    }

    if (!matter) {
      throw new NotFoundException({
        message: 'La materia no existe.',
      });
    }
    return matter;

  }

  async update(id: string, updateMatterDto: UpdateMatterDto) {
    
    const [error, matter] = await to(this.findOne(id));

    if (error) {
      throw new InternalServerErrorException(error);
    }

    matter.name = updateMatterDto.name;

    if (updateMatterDto.requirements) {
      
      const updateRequirements: any[] = updateMatterDto.requirements;

      //Filters new requirements that are not already in matter.requirements
      const uniqueNewRequirements: Matter[] = updateRequirements
        .filter(newReq => !matter.requirements.some(existingReq => existingReq.name === newReq.name));
      
      matter.requirements = [...matter.requirements, ...uniqueNewRequirements];

    }

    try {
        
      const [errorUpdate, matterUpdated] = await to(
        this.matterRepository.save(matter),
      );
      if (errorUpdate) {
        throw new InternalServerErrorException(errorUpdate);
      }

      return matterUpdated;

    } catch (error) {
      throw new InternalServerErrorException('Failed to update the matter.', error);
    }

  }
  
}
