import { formatJSONResponse, type ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { PrismaClient } from '@prisma/client'
import schema from './schema';


const deleteTask: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const prisma = new PrismaClient()
  const params = event.pathParameters!
  await prisma.tasks.delete({ where: { id: +params.id! } })
  
  return formatJSONResponse({
    message: `Task successfully deleted!`,
  });
};

export const main = middyfy(deleteTask);
