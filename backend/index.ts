import {
  PostConfirmationConfirmSignUpTriggerEvent,
  APIGatewayProxyEvent,
  SQSEvent,
} from "aws-lambda";
import userService from "./services/users";
import fileService from "./services/files";
import contentProcess from "./services/contentProcess";
import searchService from "./services/search";
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
  const transcriptData = await contentProcess.getTranscriptDetails(
    eventData.transcript_id
  );
  console.log("Transcript data is ", transcriptData);
  const fileId = await fileService.updateTranscriptionDetails(
    transcriptData,
    eventData.transcript_id
  );
  await searchService.addDataToIndex(
    transcriptData,
    eventData.transcript_id,
    fileId
  );

  return success({ message: "OK" });
}

export async function getUserFiles(event: APIGatewayProxyEvent) {
  const userId = event.requestContext.authorizer!.claims["custom:userId"];
  try {
    const userFiles = await fileService.getUserFiles(userId);
    return success(userFiles);
  } catch (err) {
    return failure(err);
  }
}

export async function addUserFiles(event: APIGatewayProxyEvent) {
  const userId = event.requestContext.authorizer!.claims["custom:userId"];
  const requestBody = JSON.parse(event.body!);
  try {
    const fileDetails = await fileService.addUserFiles(userId, requestBody);
    // TO DO add event to SQS for downstream processing
    await contentProcess.addItemToQueue(fileDetails);
    return success(fileDetails);
  } catch (err) {
    return failure(err);
  }
}
