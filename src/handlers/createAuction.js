import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';

//config para offline de Dynamo 
// const IS_OFFLINE = process.env.IS_OFFLINE;
// let dynamodb;

// if (IS_OFFLINE === 'true') {
//   dynamodb = new AWS.DynamoDB.DocumentClient({
//     region: 'localhost',
//     endpoint: 'http://localhost:8000'
//   })
// } else {
//   const dynamodb = new AWS.DynamoDB.DocumentClient();
// }

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {

  const { title, autor } = event.body;

  const now = new Date();

  const auction = {
    id: uuid(),
    title,
    autor,
    status: 'OPEN',
    createdAt: now.toISOString(),
    highestBid: {
      amount: 0,
    },
  };

  try {
    //meter datos a dynamo
    await dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction
    }).promise();

  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }


  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(createAuction);

