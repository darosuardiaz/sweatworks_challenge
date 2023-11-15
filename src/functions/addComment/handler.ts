import { DynamoDB } from 'aws-sdk';
import { formatJSONResponse, type ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';


const addComment: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const id = +event.pathParameters!.id!
    const { comment } = event.body
    

    // Initialize the DynamoDB DocumentClient
    const dynamoDB = new DynamoDB.DocumentClient();

    // Create a new comment item
    const commentItem: DynamoDB.DocumentClient.PutItemInput = {
      TableName: 'TaskComments',
      Item: {
        taskId: id,
        comment: comment,
      },
    };

    // Save the comment item to DynamoDB
    await dynamoDB.put(commentItem).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Comment added successfully' }),
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error }),
    };
  }

};

export const main = middyfy(addComment);
