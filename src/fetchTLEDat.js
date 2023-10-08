import * as conf from './config'
require('dotenv').config();
var AWS = require("aws-sdk");
AWS.config.update({region:'us-east-1'});
AWS.config.update({
    accessKeyId: conf.AWS_ACCESS_KEY,
    secretAccessKey: conf.AWS_SECRET_KEY
});

const documentClient = new AWS.DynamoDB.DocumentClient();
const tableName = 'TLEData';


export async function fetchResultsFromddbtable(st) {
        try {
            var params = {
                KeyConditionExpression: "SatType =:query",
                ExpressionAttributeValues: {
                    ":query" : st
                },
                TableName: tableName
            };
            var result = await documentClient.query(params).promise()
            return result.$response['data']['Items']
            //return result.$response.data
        } catch (error) {
            console.error(error);
        }
}





