import * as uuid from "uuid";
import AWS from "../libs/aws-sdk";
import dynamoDb from "../libs/dynamodb-lib";

const S3 = new AWS.S3();

export default {
  getPreSignedUrl: async () => {
    const url = await S3.getSignedUrl("putObject", {
      Bucket: process.env.bucketName,
      Key: uuid.v4(),
      Expires: 30,
    });
    return url;
  },
  getUserFiles: async (userId: string) => {
    // TODO implement pagination here
    const getUserFilesParams = {
      TableName: process.env.filesTable,
    };
  },
  addTranscriptionId: async (data, transcriptionId: string) => {
    // update dynamodb record with the transcriptionId
    const updateFilesParams = {
      TableName: process.env.filesTable,
      Key: {
        userId: data.userId,
        createdAt: data.createdAt,
      },
      UpdateExpression: "set transcriptionId = :tid , status = :status",
      ExpressionAttributeValues: {
        ":tid": transcriptionId,
        ":status": "PENDING",
      },
    };
    await dynamoDb.update(updateFilesParams);
  },
};
