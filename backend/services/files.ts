import * as uuid from "uuid";
import AWS from "../libs/aws-sdk";
import dynamoDb from "../libs/dynamodb-lib";

const S3 = new AWS.S3();

export default {
  getPreSignedUrl: async (contentType: string) => {
    const params = {
      Bucket: process.env.bucketName,
      Key: uuid.v4(),
      Expires: 30,
      ContentType: contentType,
    };
    const url = await S3.getSignedUrl("putObject", params);
    console.log("params is", params);
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
      ScanIndexForward: false,
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
      UpdateExpression: "set transcriptionId = :tid , processingStatus = :stat",
      ExpressionAttributeValues: {
        ":tid": transcriptionId,
        ":stat": "PENDING",
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
      UpdateExpression: "set processingStatus = :stat , textData = :text",
      ExpressionAttributeValues: {
        ":stat": "COMPLETED",
        ":text": transcriptData.text,
      },
      ReturnValues: "ALL_NEW",
    };
    const updatedFileDetails = await dynamoDb.update(updateFilesParams);
    return updatedFileDetails.Attributes;
  },
  addUserFiles: async (userId: string, data) => {
    const fileItem = {
      userId,
      createdAt: new Date().toISOString(),
      fileId: data.fileId,
      url: data.url,
      processingStatus: "PENDING",
      fileName: data.fileName || "",
    };
    const putParams = {
      TableName: process.env.filesTable,
      Item: fileItem,
    };
    await dynamoDb.put(putParams);
    return fileItem;
  },
};
