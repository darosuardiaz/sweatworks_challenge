import { PrismaClient } from '@prisma/client'
import { type ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { sendResponse, errorHandler } from '@libs/middlewares';
import schema from './schema';

// Instance prisma client for db access
const prisma = new PrismaClient()

const deleteTask: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try{
    // request input
    const taskId = event.pathParameters!.id!

    // validate input
    if(!parseInt(taskId)) return errorHandler(400, "Invalid request params")

    // delete task from db
    await prisma.tasks.delete({ where: { id:  +taskId} })
    
    return sendResponse(200, {message: `Task id ${taskId} successfully deleted!`})
  }
  catch(error){
    console.error('Error deleting task:', error);
    return errorHandler(500, "Server Error")
  }
};

export const main = middyfy(deleteTask);
