import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { TaskPriority } from '../../types/task.type';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: ['low', 'medium', 'high'] })
  priority: TaskPriority;

  @ManyToOne(() => User, (user: User) => user.tasks, { nullable: true })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
