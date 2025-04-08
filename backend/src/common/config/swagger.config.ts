import { DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { TasksModule } from '../../tasks/tasks.module';
import { AuthModule } from '../../auth/auth.module';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('BlueWindow Todo API')
  .setDescription('Full-stack challenge submission')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

export const swaggerOptions: SwaggerDocumentOptions = {
  include: [TasksModule, AuthModule],
  operationIdFactory: (_, methodKey) => methodKey,
};
