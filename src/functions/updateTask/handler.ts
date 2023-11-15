import { formatJSONResponse, type ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { PrismaClient } from '@prisma/client'
import schema from './schema';

interface UpdateDto {
  name?: string;
  completed?: boolean;
}

const prisma = new PrismaClient()

const updateTask: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {  
  const taskId = +event.pathParameters!.id!
  const body: UpdateDto = event.body

  let timestamps
  body.completed 
    ? timestamps = { completed_ts: new Date(), last_update_ts: new Date() }
    : timestamps = { last_update_ts: new Date() }

  const task = await prisma.tasks.update({ 
    where: 
      { id: taskId }, 
      data: {...body, ...timestamps}
    })
  
  return formatJSONResponse({
    message: `Task id: ${task.id} updated successfully!`,
  });
};

export const main = middyfy(updateTask);
