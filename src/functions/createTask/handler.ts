import { type ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { PrismaClient } from '@prisma/client'
import schema from './schema';
import { sendResponse, errorHandler } from '@libs/middlewares';

// Instance prisma client for db access
const prisma = new PrismaClient()


const createTask: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try{
    const body = event.body

    // save task to db
    const task = await prisma.tasks.create({ data: { name: body.name } })

    return sendResponse(200, { message: `Task created successfully! id: ${task.id}` })
  }
  catch(error){
    console.error('Error creating task:', error);
    return errorHandler(500, error!)
  }
};

export const main = middyfy(createTask);
