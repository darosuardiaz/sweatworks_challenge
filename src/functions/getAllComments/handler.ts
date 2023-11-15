import { DynamoDB } from 'aws-sdk';
import { type ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { sendResponse, errorHandler } from '@libs/middlewares';
import schema from './schema';

interface Comment {
  taskId: string;
  comment: string;
}

// Initialize the DynamoDB DocumentClient
const dynamoDB = new DynamoDB.DocumentClient();

const getAllComments: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const params = event.pathParameters!
    const taskId = +params.id!

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
    const comments: Comment[] = result.Items as Comment[];

    return sendResponse(200, { comments })
  } 
  catch (error) {
    console.error('Error adding comment:', error);
    return errorHandler(500, error!)
  }
};

export const main = middyfy(getAllComments);
