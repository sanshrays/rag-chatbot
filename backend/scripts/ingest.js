const Parser = require('rss-parser');
const { embedText } = require('../embeddings/embedder.js');
const { insertVector, initCollection } = require('../vectorstore/chromaClient.js');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

const parser = new Parser();
const FEED_URL = 'https://feeds.reuters.com/reuters/topNews';
const MAX_ARTICLES = 50;

const runIngestion = async () => {
  await initCollection();

  console.log('📥 Fetching RSS feed...');
  const feed = await parser.parseURL(FEED_URL);
  const articles = feed.items.slice(0, MAX_ARTICLES);

  console.log(`📰 Embedding and indexing ${articles.length} articles...`);

  for (const article of articles) {
    const id = uuidv4();
    const text = `${article.title}\n${article.contentSnippet}`;
    try {
      const embedding = await embedText(text);
      await insertVector(id, text, embedding, {
        link: article.link,
        title: article.title,
        pubDate: article.pubDate,
      });
      console.log(`✅ Indexed: ${article.title}`);
    } catch (err) {
      console.error(`❌ Failed: ${article.title}`, err.message);
    }
  }

  console.log('🚀 Done ingesting articles into Chroma.');
};

runIngestion();
