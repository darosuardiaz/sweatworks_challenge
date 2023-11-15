import { DynamoDB } from 'aws-sdk';
import { formatJSONResponse, type ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';

interface Comment {
  taskId: string;
  comment: string;
}

const getAllComments: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const taskId = +event.pathParameters!.id!

    // Initialize the DynamoDB DocumentClient
    const dynamoDB = new DynamoDB.DocumentClient();

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

    return {
      statusCode: 200,
      body: JSON.stringify({ comments }),
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error }),
    };
  }

};

export const main = middyfy(getAllComments);
