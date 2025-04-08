import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { Task } from '../entities/task.entity';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly logger: Logger,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks', type: [Task] })
  async findAll(): Promise<Task[]> {
    this.logger.debug('GET /tasks - Retrieving all tasks');
    const tasks = await this.tasksService.findAll();
    this.logger.debug(`GET /tasks - Retrieved ${tasks.length} tasks`);
    return tasks;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by id' })
  @ApiResponse({ status: 200, description: 'Return a task by id', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    this.logger.debug(`GET /tasks/${id} - Retrieving task by id`);
    const task = await this.tasksService.findOne(id);
    this.logger.debug(`GET /tasks/${id} - Retrieved task successfully`);
    return task;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: Task,
  })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    this.logger.debug(
      `POST /tasks - Creating new task: ${JSON.stringify(createTaskDto)}`,
    );
    const task = await this.tasksService.create(createTaskDto);
    this.logger.debug(`POST /tasks - Created task with id: ${task.id}`);
    return task;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: Task,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    this.logger.debug(
      `PUT /tasks/${id} - Updating task: ${JSON.stringify(updateTaskDto)}`,
    );
    const task = await this.tasksService.update(id, updateTaskDto);
    this.logger.debug(`PUT /tasks/${id} - Updated task successfully`);
    return task;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.logger.debug(`DELETE /tasks/${id} - Removing task`);
    await this.tasksService.remove(id);
    this.logger.debug(`DELETE /tasks/${id} - Removed task successfully`);
  }
}
