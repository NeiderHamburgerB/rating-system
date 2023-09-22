import { 
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({ name: 'student' })
export class Student {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'jsonb', unique:true })
    document: {
        type: string;
        value: string;
    };

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar' })
    lastname: string;

    @Column({ unique: true, type: 'varchar' })
    email: string;

    @Column({ type: 'varchar' })
    password: string;

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