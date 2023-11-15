import { DynamoDB } from 'aws-sdk';
import { type ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { sendResponse, errorHandler } from '@libs/middlewares';
import schema from './schema';
import { AddCommentDto } from './types';

// Initialize the DynamoDB DocumentClient
const dynamoDB = new DynamoDB.DocumentClient();

const addComment: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    // request inputs
    const taskId = event.pathParameters!.id!
    const body: AddCommentDto = event.body;

    // validate inputs
    if(!parseInt(taskId)) return errorHandler(400, "Invalid request params")

    // Create a new comment item
    const commentItem: DynamoDB.DocumentClient.PutItemInput = {
      TableName: 'TaskComments',
      Item: {
        taskId: taskId,
        comment: body.comment,
      },
    };

    // Save the comment item to DynamoDB
    await dynamoDB.put(commentItem).promise();
    return sendResponse(200, { message: `Comment added successfully to task id: ${taskId}` })
    
  } catch (error) {
    console.error('Error adding comment:', error);
    return errorHandler(500, "Server Error")
  }

};

export const main = middyfy(addComment);
