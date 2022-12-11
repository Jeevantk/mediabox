import {
  PostConfirmationConfirmSignUpTriggerEvent,
  APIGatewayProxyEvent,
  SQSEvent,
} from "aws-lambda";
import userService from "./services/users";
import fileService from "./services/files";
import contentProcess from "./services/contentProcess";
import { failure, success } from "./libs/response-lib";

export async function createAccount(
  event: PostConfirmationConfirmSignUpTriggerEvent,
  context,
  callback
) {
  let userEmail = event.request.userAttributes["email"];
  await userService.createProfile(userEmail, event.userName);
  console.log("event is ", event);
  callback(null, event);
}

export async function getPreSignedUrl(event: APIGatewayProxyEvent) {
  try {
    const url = await fileService.getPreSignedUrl();
    return success({ signedUrl: url });
  } catch (err) {
    return failure(err);
  }
}

export async function sendFilesToAssembly(event: SQSEvent) {
  const eventData = JSON.parse(event.Records[0].body);
  const transcriptionId = await contentProcess.sendFilesToAssembly(eventData);
  await fileService.addTranscriptionId(eventData, transcriptionId);
  return JSON.stringify({ body: "Done" });
  // NOT Adding try catch here since sqs will auto retry in case of error
}

export async function assemblyWebhook(event: APIGatewayProxyEvent) {
  console.log("assembly webhook event", event);
  const eventData = JSON.parse(event.body!);
  // TODO -> fetch transcript details from
  const transcriptData = await contentProcess.getTranscriptDetails(
    eventData.transcript_id
  );
  console.log("Transcript data is ", transcriptData);
  return success({ message: "OK" });
  //add data to dynamodb and algolia
}
