import type { AWS } from '@serverless/typescript';
import createTask from '@functions/createTask';
import getAllTasks from '@functions/getAllTasks';
import getTask from '@functions/getTask';
import deleteTask from '@functions/deleteTask';
import updateTask from '@functions/updateTask';
import addComment from '@functions/addComment';
import getAllComments from '@functions/getAllComments';


const serverlessConfiguration: AWS = {
  service: 'tasks-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    // iam permission for dynamoDB
    iam: {
      role: {
        statements: [{
          Effect: "Allow",
          Action: [
            "dynamodb:DescribeTable",
            "dynamodb:Query",
            "dynamodb:Scan",
            "dynamodb:GetItem",
            "dynamodb:PutItem",
            "dynamodb:UpdateItem",
            "dynamodb:DeleteItem",
          ],
          Resource: "arn:aws:dynamodb:us-east-1:160087197325:table/TaskComments",
        }],
      },
    },
  },
  // import functions
  functions: {
    createTask,
    getAllTasks,
    getTask,
    deleteTask,
    updateTask,
    addComment,
    getAllComments,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      CommentsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'TaskComments',
          AttributeDefinitions: [
            { AttributeName: 'taskId', AttributeType: 'N' },
            { AttributeName: 'timestamp', AttributeType: 'S' },
          ],
          KeySchema: [
            { AttributeName: 'taskId', KeyType: 'HASH' },
            { AttributeName: 'timestamp', KeyType: 'RANGE' },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      },
      TasksDb: {
        Type: 'AWS::RDS::DBInstance',
        Properties: {
          Engine: 'postgres',
          DBInstanceIdentifier: 'tasks',
          MasterUsername: 'pgadmin',
          MasterUserPassword: 'pgadmin123',
          AllocatedStorage: 20,
          DBInstanceClass: 'db.t3.micro',
          EngineVersion: '15.3',
          MultiAZ: false,
          PubliclyAccessible: true, // false for prod
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
