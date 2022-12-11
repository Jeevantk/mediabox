import AWS from "./aws-sdk";

const sqs = new AWS.SQS({
  region: process.env.awsRegion,
});
export default {
  sendMessage: (params) => sqs.sendMessage(params).promise(),
};
