import { v4 as uuid} from 'uuid';
import AWS from 'aws-sdk'

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "AuctionsTable";

async function createAuction(event, context) {
  console.log("Converting Payload . . .");
  const { payload } = JSON.parse(event.body);
  const now = new Date();
  const auctionItem = {
    id: uuid(),
    payload,
    status: 'OPEN_TO_TRADE',
    createdAt: now.toISOString(),
  };

  var params = {
      TableName: TABLE_NAME,
      Item: auctionItem
  };
  console.log(params);
  var result = "";
  console.log("Inserting Into Table . . .");
  await dynamodb.put(params).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      msg:"Item Was Inserted!",
      item: auctionItem
    }),
  };
}

export const handler = createAuction;