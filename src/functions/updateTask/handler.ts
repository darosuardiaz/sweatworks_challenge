import { PrismaClient } from '@prisma/client'
import { type ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { sendResponse, errorHandler } from '@libs/middlewares';
import schema from './schema';
import { UpdateTaskDto } from './types';

// Instance prisma client for db access
const prisma = new PrismaClient()

const updateTask: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {  
  try{
    // request inputs
    const taskId = event.pathParameters!.id!
    const body: UpdateTaskDto = event.body;

    // validate inputs
    if(!parseInt(taskId)) return errorHandler(400, "Invalid request params")
    if(!(body.completed || body.name)) return errorHandler(400, "Invalid request body")
    
    let timestamps
    body.completed 
      ? timestamps = { completed_ts: new Date(), last_update_ts: new Date() }
      : timestamps = { last_update_ts: new Date() }

    // update task on db
    const task = await prisma.tasks.update({ 
      where: 
        { id: +taskId }, 
        data: {...body, ...timestamps}
    })

    return sendResponse(200, {message: `Task id: ${task.id} updated successfully!`})
  }
  catch(error){
    console.error('Error getting all tasks:', error);
    return errorHandler(500, "Server Error")
  }
};

export const main = middyfy(updateTask);
