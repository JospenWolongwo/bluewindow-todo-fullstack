import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from 'nestjs-pino';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private readonly logger: Logger,
  ) {}

  async findAll(): Promise<Task[]> {
    this.logger.debug('Finding all tasks');
    const tasks = await this.tasksRepository.find();
    this.logger.debug(`Found ${tasks.length} tasks`);
    return tasks;
  }

  async findOne(id: number): Promise<Task> {
    this.logger.debug(`Finding task with id: ${id}`);
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      this.logger.warn(`Task with ID ${id} not found`);
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    this.logger.debug(`Found task: ${JSON.stringify(task)}`);
    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    this.logger.debug(`Creating new task: ${JSON.stringify(createTaskDto)}`);
    const task = this.tasksRepository.create(createTaskDto);
    const savedTask = await this.tasksRepository.save(task);
    this.logger.debug(`Task created successfully with id: ${savedTask.id}`);
    return savedTask;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    this.logger.debug(
      `Updating task with id: ${id} - Data: ${JSON.stringify(updateTaskDto)}`,
    );
    const task = await this.findOne(id);
    this.tasksRepository.merge(task, updateTaskDto);
    const updatedTask = await this.tasksRepository.save(task);
    this.logger.debug(
      `Task updated successfully: ${JSON.stringify(updatedTask)}`,
    );
    return updatedTask;
  }

  async remove(id: number): Promise<void> {
    this.logger.debug(`Removing task with id: ${id}`);
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
    this.logger.debug(`Task with id: ${id} removed successfully`);
  }
}
