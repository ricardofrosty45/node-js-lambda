var AWS = require('aws-sdk');
const TABLE_NAME = "AuctionsTable";

module.exports.putItem = {
    putItem: async function putItemIntoDatabase(resultInsert,item){
        console.log("chegou!!! entrou!");
        var docClient = new AWS.DynamoDB.DocumentClient();
        var params = {
            TableName: TABLE_NAME,
            Item: item
        };
        console.log(params);
        var result = "";
        await docClient.put(params).promise().then(function(data) {
            console.log("data", data);
            result = { status : 200,
                      result: "Sucess",
                      id: item.id, 
                      message: "Item has been inserted with success"};
        }).catch(function(err){
            console.error("Error : ", err);
            result = { status : 200,
                      result : "Error",
                      message: err};
        });
        resultInsert(result);
      }
  };