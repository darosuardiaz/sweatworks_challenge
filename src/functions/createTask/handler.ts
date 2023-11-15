import { formatJSONResponse, type ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { PrismaClient } from '@prisma/client'
import schema from './schema';

const createTask: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const prisma = new PrismaClient()
  const body = event.body

  const task = await prisma.tasks.create({ data: { name: body.name } })
  
  return formatJSONResponse({
    message: `Task created successfully! id: ${task.id}`,
  });
};

export const main = middyfy(createTask);
