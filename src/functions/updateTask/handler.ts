import { PrismaClient } from '@prisma/client'
import { type ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { sendResponse, errorHandler } from '@libs/middlewares';
import schema from './schema';

interface UpdateDto {
  name?: string;
  completed?: boolean;
}

// Instance prisma client for db access
const prisma = new PrismaClient()

const updateTask: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {  
  try{
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

    return sendResponse(200, {message: `Task id: ${task.id} updated successfully!`})
  }
  catch(error){
    console.error('Error getting all tasks:', error);
    return errorHandler(500, error!)
  }
};

export const main = middyfy(updateTask);
