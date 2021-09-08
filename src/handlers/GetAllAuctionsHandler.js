import { v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createHttpError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAllAuctionsFromDatabase(event, context) {
    
    var params = {
        TableName: process.env.AUCTIONS_TABLE_NAME
    };
    
    var result = "";

    await dynamodb.scan(params).promise().then(function onScan(data) {
        console.log(data);
        result = {
                    "status": 200,
                    "result": "Success",
                    "data" : data,
                    "message": "Query has been executed with success"
                 }

    }).catch(function(err){
        console.log(err);
        result = {
                    "status" : 200,
                    "result" : "Error",
                    "message": err
                }
        throw new createHttpError.BadGateway(result);
    }); 

    console.log(result);

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
}

export const handler = middy(getAllAuctionsFromDatabase)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());