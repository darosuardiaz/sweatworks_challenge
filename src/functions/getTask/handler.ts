import { PrismaClient } from '@prisma/client'
import { type ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { sendResponse, errorHandler } from '@libs/middlewares';
import schema from './schema';

// Instance prisma client for db access
const prisma = new PrismaClient()


const getTask: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try{
    // request input
    const taskId = event.pathParameters!.id!

    // validate input
    if(!parseInt(taskId)) return errorHandler(400, "Invalid request params")

    // fetch task from db
    const task = await prisma.tasks.findFirst({ where: { id: +taskId } })
    return sendResponse(200, { task })
  } 
  catch(error){
    console.error(`Error getting task: `, error);
    return errorHandler(500, "Server Error")
  } 
};

export const main = middyfy(getTask);
