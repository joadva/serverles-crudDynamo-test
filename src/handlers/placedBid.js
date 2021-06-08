import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

// const IS_OFFLINE = process.env.IS_OFFLINE;
// let dynamodb;

// if (IS_OFFLINE === 'true') {
//     dynamodb = new AWS.DynamoDB.DocumentClient({
//         region: 'localhost',
//         endpoint: 'http://localhost:8000'
//     })
// } else {
//     const dynamodb = new AWS.DynamoDB.DocumentClient();
// }
const dynamodb = new AWS.DynamoDB.DocumentClient();

// modificar solo la oferta  == ammounbt :v 
async function placedBid(event, context) {

    const { id } = event.pathParameters;
    const { amount } = event.body;

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set highestBid.amount = :amount',
        ExpressionAttributeValues: {
            ':amount': amount,
        },
        ReturnValues: 'ALL_NEW'
    };

    let updateAuction;

    try {
        const result = await dynamodb.update(params).promise();
        updateAuction = result.Attributes;
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);

    }

    return {
        statusCode: 201,
        body: JSON.stringify(updateAuction),
    };
}
export const handler = commonMiddleware(placedBid);


