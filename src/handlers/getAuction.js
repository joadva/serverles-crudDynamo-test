import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
    let auction;
    const { id } = event.pathParameters;


    try {
        //obtener dato por id  de dynamo
        const result = await dynamodb.get({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: { id },
        }).promise();

        auction = result.Item;
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
    if (!auction) {
        throw new createError.NotFound(`Auction with ID "${id}" not found!`);
    }
    return {
        statusCode: 201,
        body: JSON.stringify(auction),
    };
}
export const handler = commonMiddleware(getAuction);

