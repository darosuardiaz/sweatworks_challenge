import { DynamoDB } from 'aws-sdk';
import { type ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { sendResponse, errorHandler } from '@libs/middlewares';
import schema from './schema';
import { TaskComment } from './types';

// Initialize the DynamoDB DocumentClient
const dynamoDB = new DynamoDB.DocumentClient();

const getAllComments: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    // request input
    const taskId = event.pathParameters!.id!

    // validate input
    if(!parseInt(taskId)) return errorHandler(400, "Invalid request params")

    // Query DynamoDB for comments by task ID
    const queryParams: DynamoDB.DocumentClient.QueryInput = {
      TableName: 'TaskComments', // Replace with your DynamoDB table name
      KeyConditionExpression: 'taskId = :taskId',
      ExpressionAttributeValues: {
        ':taskId': taskId,
      },
    };

    const result = await dynamoDB.query(queryParams).promise();

    // Parse the DynamoDB result into a list of Comment objects
    const comments: TaskComment[] = result.Items as TaskComment[];

    return sendResponse(200, { comments })
  } 
  catch (error) {
    console.error('Error gettin all comments:', error);
    return errorHandler(500, "Server Error")
  }
};

export const main = middyfy(getAllComments);
