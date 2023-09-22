import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto, UpdateStudentDto } from './student.dto';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Student } from 'src/models/student/student.entity';
import { hashSync, genSaltSync } from 'bcryptjs'
import to from 'await-to-js';
import { IStudentSearch } from 'src/interfaces/IStudentSearch.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StudentsService {

  constructor(
    private dataSource: DataSource,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,){}

  async create(createStudentDto: CreateStudentDto) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create student
      const [errorStudent, student] = await to<Student>(
        this.createStudent(
          queryRunner.manager,
          createStudentDto
        ),
      );

      if (errorStudent) {
        throw new BadRequestException(errorStudent);
      }

      await queryRunner.commitTransaction();

      return student.id;

    } catch (error: Error | any) {
      
      await queryRunner.rollbackTransaction();
      // Internal Error
      throw error;

    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }

  }

  private async createStudent(
    entityManager: EntityManager,
    studentInfo: CreateStudentDto,
  ): Promise<Student> {
    //Creating Student
    const [errorExist, exists] = await to(
      entityManager.findOne(Student, {
        where: {
          email: studentInfo.email,
        },
        select: ['id'],
      }),
    );

    if (errorExist) {
      throw new BadRequestException(errorExist);
    }

    if (exists) {
      throw new BadRequestException({
        message: 'El email con el que se intenta registrar no está disponible'
      });
    }

    const student = entityManager.create<Student>(Student, studentInfo);
   
    student.password = await this.encryptPassword(student.password); //encrypt

    const [errorStudent, newStudent] = await to(entityManager.save(Student, student));

    delete student.password;

    if (errorStudent) {
      throw new BadRequestException(errorStudent);
    }

    return newStudent;
  }

  encryptPassword(password: string) {
    return hashSync(password, genSaltSync(8));
  }

  findAll() {
    return `This action returns all students`;
  }

  async findOne(data:IStudentSearch) {
    const [error, student] = await to(
      this.studentRepository.findOne({
        where: data
      }),
    );

    if (error) {
      throw new BadRequestException(error);
    }

    if (!student) {
      throw new NotFoundException({
        message: 'El estudiante no existe.',
      });
    }
    return student;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
