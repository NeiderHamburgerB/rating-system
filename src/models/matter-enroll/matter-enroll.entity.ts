import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Matter } from '../matter/matter.entity';
import { Student } from '../student/student.entity';

export enum StatusDefault {
  EN_CURSO = "EN CURSO",
  FINALIZADA = "FINALIZADA"
}

@Entity({ name: 'matter_enroll'})
export class MatterEnroll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Matter, (matter) => matter.id)
  @JoinColumn({ name: 'matter_id' })
  matter: Matter;

  @Column({ type: 'uuid', nullable: true })
  matter_id: string;

  @ManyToOne(() => Student, (student) => student.id)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'number', nullable: true })
  student_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  score: number;

  @Column({
    type: 'enum',
    enum: StatusDefault,
    default: StatusDefault.EN_CURSO,
  })
  status: string = StatusDefault.EN_CURSO;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
      default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
      name: 'updated_at',
      type: 'timestamptz',
      default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

}