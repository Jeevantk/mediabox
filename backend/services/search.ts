import * as uuid from "uuid";
import AWS from "../libs/aws-sdk";
import dynamoDb from "../libs/dynamodb-lib";
import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_KEY
);
const algIndex = client.initIndex(process.env.ALGOLIA_INDEX_NAME);

export default {
  addDataToIndex: async (transcriptData, transcriptionId, fileId) => {
    const record = {
      objectID: fileId,
      text: transcriptData.text,
      transcriptionId: transcriptionId,
    };
    await algIndex.saveObject(record);
  },
};
