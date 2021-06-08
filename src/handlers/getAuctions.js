import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

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


async function getAuctions(event, context) {
    let auctions;

    try {
        //obtener datos de dynamo
        const result = await dynamodb.scan({
            TableName: process.env.AUCTIONS_TABLE_NAME
        }).promise();

        auctions = result.Items;
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
    return {
        statusCode: 201,
        body: JSON.stringify(auctions),
    };
}
export const handler = commonMiddleware(getAuctions);


