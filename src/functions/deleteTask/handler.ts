import { PrismaClient } from '@prisma/client'
import { DynamoDB } from 'aws-sdk';
import { type ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { sendResponse, errorHandler } from '@libs/middlewares';
import schema from './schema';

// Instance prisma client for db access
const prisma = new PrismaClient()
// Initialize the DynamoDB DocumentClient
const dynamoDB = new DynamoDB.DocumentClient();

const deleteTask: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try{
    // request input
    const taskId = event.pathParameters!.id!

    // validate input
    if(!parseInt(taskId)) return errorHandler(400, "Invalid request params")

    // delete task from db
    await prisma.tasks.delete({ where: { id:  +taskId} })

    // query dynamo for task comments
    const queryResult = await dynamoDB.query({
      TableName: 'TaskComments', // Replace with your DynamoDB table name
      KeyConditionExpression: 'taskId = :taskId',
      ExpressionAttributeValues: {
        ':taskId': +taskId,
      },
    }).promise();

    // delete each comment
    if(queryResult.Items){
      queryResult.Items.map(async (commentItem) => {
        await dynamoDB.delete({
          TableName: process.env.DYNAMO_DB_TABLE!,
          Key: {
            taskId: commentItem.taskId,
            timestamp: commentItem.timestamp,
          },
        }).promise();
      });
    }
    
    return sendResponse(200, {message: `Task id ${taskId} successfully deleted!`})
  }
  catch(error){
    console.error('Error deleting task:', error);
    return errorHandler(500, "Server Error")
  }
};

export const main = middyfy(deleteTask);
