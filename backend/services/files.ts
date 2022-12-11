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
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };
    let userFiles = await dynamoDb.query(getUserFilesParams);
    return userFiles.Items;
  },
  addTranscriptionId: async (data, transcriptionId: string) => {
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
  updateTranscriptionDetails: async (
    transcriptData,
    trnascriptionId: string
  ) => {
    const getFileParams = {
      TableName: process.env.filesTable,
      IndexName: "transcriptionIdIndex",
      KeyConditionExpression: `transcriptionId= :tid`,
      ExpressionAttributeValues: {
        ":tid": trnascriptionId,
      },
    };
    const fileDetails = (await dynamoDb.query(getFileParams)).Items[0];
    const updateFilesParams = {
      TableName: process.env.filesTable,
      Key: {
        userId: fileDetails.userId,
        createdAt: fileDetails.createdAt,
      },
      UpdateExpression: "set words = :words , status = :status , text = :text",
      ExpressionAttributeValues: {
        ":tid": transcriptData.words,
        ":status": "COMPLETED",
        ":text": transcriptData.text,
      },
    };
    await dynamoDb.update(updateFilesParams);
    return fileDetails.fileId;
  },
  addUserFiles: async (userId: string, data) => {
    const fileItem = {
      userId,
      createdOn: new Date().toISOString(),
      fileId: data.fileId,
      url: data.url,
    };
    const putParams = {
      TableName: process.env.filesTable,
      Item: fileItem,
    };
    await dynamoDb.put(putParams);
  },
};
