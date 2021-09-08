import { v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createHttpError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {

  console.log("Converting Payload . . .");
  const requestBody = event.body;
  var result = "";
  
  console.log("Creating Auction Item . . .")
  const auctionItem = {
    id: uuid(),
    requestBody: JSON.stringify(requestBody),
    status: 'OPEN_TO_TRADE',
    createdAt: new Date().toISOString(),
  };
  console.log(auctionItem);
  console.log("Creating Database Item . . .")

  var params = {
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auctionItem
  };
  console.log(params);
  var result = "";
  console.log("Inserting Into Table . . .");

 await dynamodb.put(params).promise().then(function(data) {
        console.log("data", data);
        result = 
        {
           status : 200,
           result: "Sucess",
           id: params.Item.id, 
           message: "Item has been inserted with success"
        };
    }).catch(function(err){
        console.error("Error : ", err);

        result = 
        { 
          status : 502,   
          result : "Error",
          message: err  
        };
        throw new createHttpError.BadGateway(result);
    });
  console.log(result)


  return {
    statusCode: 201,
    body: JSON.stringify(result),
  };
}

export const handler = middy(createAuction)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
  