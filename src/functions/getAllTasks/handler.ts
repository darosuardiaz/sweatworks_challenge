import { PrismaClient } from '@prisma/client'
import { type ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { sendResponse, errorHandler } from '@libs/middlewares';
import schema from './schema';

// Instance prisma client for db access
const prisma = new PrismaClient()


const getAllTasks: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try{
    // fetch all tasks from db
    const tasks = await prisma.tasks.findMany()
    return sendResponse(200, { tasks })
  } 
  catch(error){
    console.error('Error getting all tasks:', error);
    return errorHandler(500, error!)
  } 
};

export const main = middyfy(getAllTasks);
