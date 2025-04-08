import { DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { TasksModule } from '../../tasks/tasks.module';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('BlueWindow Todo API')
  .setDescription('Full-stack challenge submission')
  .setVersion('1.0')
  .build();

export const swaggerOptions: SwaggerDocumentOptions = {
  include: [TasksModule],
  operationIdFactory: (_, methodKey) => methodKey,
};
