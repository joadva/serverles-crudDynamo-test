import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';

const IS_OFFLINE = process.env.IS_OFFLINE;
let dynamodb;

if (IS_OFFLINE === 'true') {
    dynamodb = new AWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    })
} else {
    const dynamodb = new AWS.DynamoDB.DocumentClient();
}


async function updateAuction(event, context) {
    const { id } = event.pathParameters;
    const { title, autor, status } = event.body;

    const now = new Date();

    const auction = {
        id,
        title,
        autor,
        status,
        createdAt: now.toISOString(),
    };

    try {
        //meter datos a dynamo
        await dynamodb.update({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: { id },
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

export const handler = commonMiddleware(updateAuction);

