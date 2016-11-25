import {DynamoDB} from "aws-sdk"
import {CHAT} from "../config"
import {auth0Info} from "../helpers/auth0Tools"

export function chat(request, context) {
    let dynamodb = new DynamoDB.DocumentClient();
    let {message} = request['body-json'];

    const {Authorization} = request.params.header;

    auth0Info(Authorization)
        .then((data) => {
            const {sub} = data;

            const Item = {};
            dynamodb.put({
                TableName: CHAT.tableName,
                Item
            }).promise()
                .then(() => {
                    context.succeed(Item)
                })
                .catch((err) => {
                    console.log('Dynamo DB Write Failure');
                    console.log(request);
                    console.log(err);
                    context.fail(err);
                });
        })
        .catch((err) => {
            console.log(err);
            context.fail(err);
        });
}