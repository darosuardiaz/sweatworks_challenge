import { formatJSONResponse, type ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { PrismaClient } from '@prisma/client'
import schema from './schema';

const getAllTasks: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const prisma = new PrismaClient()
  const tasks = await prisma.tasks.findMany()
  
  return formatJSONResponse({ tasks });
};

export const main = middyfy(getAllTasks);
