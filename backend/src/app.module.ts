import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { databaseConfig, loggerConfig } from './common/config';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { Task } from './tasks/entities/task.entity';
import { User } from './auth/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig()),
    TypeOrmModule.forFeature([Task, User]),
    LoggerModule.forRoot(loggerConfig),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
