import * as uuid from "uuid";
import dynamoDb from "../libs/dynamodb-lib";
import AWS from "../libs/aws-sdk";

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18",
});

export default {
  createProfile: (email: string, cognitoName: string) => {
    var uniqueId: string = uuid.v4();

    cognitoidentityserviceprovider.adminUpdateUserAttributes(
      {
        UserAttributes: [
          {
            Name: "custom:userId",
            Value: uniqueId,
          },
        ],
        UserPoolId: process.env.cognitoPoolId,
        Username: cognitoName,
      },
      async function (err, data) {
        console.log("admin update err", err);
        console.log("admin update ", data);
        let createProfileItem = {
          userId: uniqueId,
          email: email,
          createdOn: new Date().toISOString(),
        };
        const createProfileParams = {
          TableName: process.env.profileTable,
          Item: createProfileItem,
        };

        await dynamoDb.put(createProfileParams);
      }
    );
  },
};
