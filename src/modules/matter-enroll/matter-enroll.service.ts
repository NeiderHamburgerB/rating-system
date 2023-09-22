import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMatterEnrollDto, StatusMatterEnrollDto, UpdateMatterEnrollDto } from './matter-enroll.dto';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import to from 'await-to-js';
import { MatterEnroll, StatusDefault } from 'src/models/matter-enroll/matter-enroll.entity';
import { Matter } from 'src/models/matter/matter.entity';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/utils/pagination';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MatterEnrollService {

  constructor(
    private dataSource: DataSource,
    @InjectRepository(MatterEnroll)
    private matterEnrollRepository: Repository<MatterEnroll>,
  ){}

  async create(createMatterEnrollDto: CreateMatterEnrollDto) {
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Create matter
      const [errorMatterEnroll, matterEnroll] = await to<MatterEnroll>( 
        this.createMatterEnroll(
          queryRunner.manager,
          createMatterEnrollDto
        ),
      );

      if (errorMatterEnroll) {
        throw new BadRequestException(errorMatterEnroll.message);
      }

      await queryRunner.commitTransaction();

      return matterEnroll;

    } catch (error: Error | any) {
      
      await queryRunner.rollbackTransaction();
      // Internal Error
      throw error;

    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();

    }

  }

  private async createMatterEnroll(
    entityManager: EntityManager,
    matterEnrollInfo: CreateMatterEnrollDto,
  ){

    //verify matter exists
    const [errorExist, matter] = await to(
      entityManager.findOne(Matter, {
        where: {
          id: matterEnrollInfo.matter_id,
        },
        select: ['id'],
        relations: ['requirements']
      }),
    );

    if (errorExist) {
      throw new InternalServerErrorException(errorExist)
    }

    if (!matter) {
      throw new NotFoundException('La materia que intentas matricular no existe');
    }

    //verify that you no longer have the subject enrolled
    const [errorMatterEnroll, matterEnroll] = await to(
      entityManager.findOne(MatterEnroll, {
        where: {
          id: matterEnrollInfo.matter_id,
          student_id: matterEnrollInfo.student_id,
        },
        select: ['id']
      }),
    );

    if (errorMatterEnroll) {
      throw new InternalServerErrorException(errorMatterEnroll);
    }
    
    if (matterEnroll) {
      throw new HttpException({
        message: 'Ya inscribiste esta materia'
      }, HttpStatus.BAD_REQUEST);
    }

    const enrolledMatterIds = matter.requirements.map((requirement) => requirement.id);
    
    //Obtain the student's history of subjects taken
    const [errorHistory, history] = await to(
      entityManager.find(MatterEnroll, {
        where: {
          student_id: matterEnrollInfo.student_id,
          matter_id: In(enrolledMatterIds), 
        },
        select:['score','matter_id','student_id']
      }),
    );

    if (errorHistory) {
      throw new InternalServerErrorException(errorHistory);
    }
    
    // Check if all subjects are approved
    const allMattersApproved = enrolledMatterIds.every((reqId) => {
      const historyEntry = history.find((entry) => entry.matter_id === reqId);
      return historyEntry && historyEntry.score >= 3;
    });

    if (!allMattersApproved) {
      throw new HttpException({
        message: 'No te puedes inscribir, te faltan materias por cursar o aprobar'
      }, HttpStatus.BAD_REQUEST);
    }
                                
    const matterEnrollCreated = entityManager.create<MatterEnroll>(MatterEnroll, matterEnrollInfo);
   
    const [errorMatterEnrollCreated, newMatterEnrollCreated] = await to(entityManager.save(MatterEnroll, matterEnrollCreated));

    if (errorMatterEnrollCreated) {
      throw new HttpException({
        message: errorMatterEnrollCreated
      }, HttpStatus.BAD_REQUEST);
    }

    return newMatterEnrollCreated;

  }

  async findAll(pageOptionsDto: PageOptionsDto, user_id:number): Promise<PageDto<MatterEnroll>> {
    
    const queryBuilder = this.matterEnrollRepository.createQueryBuilder('matter_enroll');

    queryBuilder
      .leftJoinAndSelect(
        'matter_enroll.matter',
        'matter',
      )
      .where('matter_enroll.student_id = :user_id', { user_id })
      .orderBy('matter_enroll.created_at', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const total = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);

  }

  async findOne(id: string) {
    const [error, matterEnroll] = await to(
      this.matterEnrollRepository.findOne({
        where: {id},
        relations:['matter', 'student'],
      }),
    );

    if (error) {
      throw new BadRequestException(error);
    }

    if (!matterEnroll) {
      throw new NotFoundException({
        message: 'El enrolamiento no existe',
      });
    }
    return matterEnroll;
  }

  async findAllByStudentId(op:StatusMatterEnrollDto, student_id:number){
    
    const [error, matterEnroll] = await to(
      this.matterEnrollRepository.find({
        where: { student_id, status: StatusDefault.FINALIZADA },
        relations:['matter', 'student'],
      }),
    );

    if(error){
      throw new InternalServerErrorException(error);
    }

    const mattersFiltered = matterEnroll.filter(matter => {
      delete matter.student.password;
      const matterScore = typeof matter.score === 'string' ? parseFloat(matter.score) : matter.score;
      if (op.status === 'APROBADA') {
        return matterScore >= 3.0;
      } else if (op.status === 'PERDIDA') {
        return matterScore < 3.0;
      } else {
        return true; 
      }
    });

    const totalMatters = mattersFiltered.length;
    const totalScores = mattersFiltered.reduce((total, matter) => total + (typeof matter.score === 'string' ? parseFloat(matter.score) : matter.score), 0);
    const promGeneral = totalMatters > 0 ? totalScores / totalMatters : 0;

    return {
      mattersFiltered,
      promGeneral,
    };

  }


  async update(id: string, updateMatterEnrollDto: UpdateMatterEnrollDto) {

    const [error, matterEnroll] = await to(this.findOne(id));

    if (error) {
      throw new InternalServerErrorException(error);
    }

    const [errorUpdated, updated] = await to(
      this.matterEnrollRepository.update(id, updateMatterEnrollDto),
    );

    if (errorUpdated) {
      throw new InternalServerErrorException(error);
    }

    return updated;

    
  }

  
}
