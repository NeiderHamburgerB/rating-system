import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({name:'matter'})
export class Matter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Matter)
  @JoinTable({
    name: 'requirements',
    joinColumn: {
      name: 'matter_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'requirement_id',
      referencedColumnName: 'id',
    },
  })
  requirements: Matter[];

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