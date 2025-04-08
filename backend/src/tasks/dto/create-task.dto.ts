import { TaskPriority } from '../../types/task.type';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['low', 'medium', 'high'])
  priority: TaskPriority;
}
