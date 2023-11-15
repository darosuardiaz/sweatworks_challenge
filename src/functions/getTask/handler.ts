import { PrismaClient } from '@prisma/client'
import { type ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { sendResponse, errorHandler } from '@libs/middlewares';
import schema from './schema';

// Instance prisma client for db access
const prisma = new PrismaClient()


const getAllTasks: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try{
    const params = event.pathParameters!
    const taskId = +params.id!

    // fetch task from db
    const task = await prisma.tasks.findFirst({ where: { id: taskId } })
    return sendResponse(200, { task })
  } 
  catch(error){
    console.error(`Error getting task: `, error);
    return errorHandler(500, error!)
  } 
};

export const main = middyfy(getAllTasks);
