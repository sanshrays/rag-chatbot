const { QdrantClient } = require('@qdrant/js-client-rest');
require('dotenv').config();

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION_NAME = process.env.COLLECTION_NAME;

async function initCollection() {
  try {
    await client.deleteCollection(COLLECTION_NAME);
  } catch (err) {
    if (err.response?.status !== 404) throw err; // Ignore if not found
  }

  await client.createCollection(COLLECTION_NAME, {
    vectors: {
      size: parseInt(process.env.EMBEDDING_DIM || '1536'), // Adjust to your embedder output size
      distance: 'Cosine',
    },
  });
}

async function getCollection() {
  return await client.getCollection(COLLECTION_NAME);
}

async function insertVector(id, text, embedding, metadata = {}) {
  await client.upsert(COLLECTION_NAME, {
    points: [
      {
        id,
        vector: embedding,
        payload: { text, ...metadata },
      },
    ],
  });
}

async function queryVectors(embedding, topK = 5) {
  const result = await client.search(COLLECTION_NAME, {
    vector: embedding,
    limit: topK,
    with_payload: true,
  });

  return result.map(r => r.payload?.colony || '');
}

async function searchVector(embedding, topK = 5) {
  return await queryVectors(embedding, topK);
}

module.exports = {
  initCollection,
  getCollection,
  insertVector,
  queryVectors,
  searchVector,
};
