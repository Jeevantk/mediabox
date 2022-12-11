import fetch from "node-fetch";
import sqs from "../libs/sqs-lib";

const ASSEMBLY_URL = "https://api.assemblyai.com/v2/transcript";

const WEBHOOK_URL =
  "https://ra0r82no96.execute-api.us-east-1.amazonaws.com/dev/assemblyai/webhook";

export default {
  sendFilesToAssembly: async (event) => {
    //TODO send event to assembly AI for processing, store the transcribe is in dynamodb for the corresponding file
    const params = {
      headers: {
        authorization: process.env.ASSEMBLYAI_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        audio_url: event.url,
        webhook_url: WEBHOOK_URL,
      }),
      method: "POST",
    };
    const data = await fetch(ASSEMBLY_URL, params);
    const body = (await data.json()) as any;
    return body.id;
  },
  getTranscriptDetails: async (transcriptId: string) => {
    const getParams = {
      headers: {
        authorization: process.env.ASSEMBLYAI_API_KEY,
        "content-type": "application/json",
      },
      method: "GET",
    };
    const data = await fetch(ASSEMBLY_URL + `/${transcriptId}`, getParams);
    const body = await data.json();
    console.log("transcript details is ", body);
    return body;
  },
  addItemToQueue: async (data) => {
    let sqsItemParams = {
      MessageBody: JSON.stringify({
        url: data.url,
        userId: data.userId,
        createdAt: data.createdAt,
        fileId: data.fileId,
      }),
      QueueUrl: process.env.processQueueUrl,
    };
    await sqs.sendMessage(sqsItemParams);
  },
};
