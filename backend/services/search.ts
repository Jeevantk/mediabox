import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_KEY
);
const algIndex = client.initIndex(process.env.ALGOLIA_INDEX_NAME);

export default {
  addDataToIndex: async (
    transcriptData,
    transcriptionId: string,
    fileDetails
  ) => {
    const record = {
      objectID: fileDetails.fileId,
      transcriptionId: transcriptionId,
      userId: fileDetails.userId,
      createdAt: fileDetails.createdAt,
      fileId: fileDetails.fileId,
      processingStatus: fileDetails.processingStatus,
      textData: transcriptData.text,
      url: fileDetails.url,
      fileName: fileDetails.fileName,
      _tags: [fileDetails.userId],
    };
    await algIndex.saveObject(record);
  },
};
