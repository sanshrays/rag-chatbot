const { searchVector } = require('../vectorstore/qdrantClient.js');
const { embedText } = require('../embeddings/embedder.js');
const { v4: uuidv4 } = require('uuid');
const redis = require('../redisClient.js');
const axios = require('axios');
require('dotenv').config();

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const handleQuery = async (req, res) => {
  const { session_id, query } = req.body;
  if (!query || !session_id) return res.status(400).json({ error: 'Missing session_id or query' });

  try {
    // 1. Embed user query
    const queryEmbedding = await embedText(query);
    const trivialQueries = ['hi', 'hello', 'hey', 'good morning'];
    let context = '';

    // 2. Retrieve top-k documents
    if(!trivialQueries.includes(query.toLowerCase())) {
      const topDocs = await searchVector(queryEmbedding, 3);
      context = topDocs.join('\n');
    }

    // 3. Gemini call
    const prompt = `Answer the user's question based on the context.\nContext:\n${context}\n\nUser: ${query}`;

    const geminiRes = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const answer = geminiRes.data.candidates[0]?.content?.parts[0]?.text || 'No answer found.';

    // 4. Cache in Redis
    const chatLog = [
      { role: 'user', text: query },
      { role: 'bot', text: answer },
    ];
    await redis.rPush(`session:${session_id}`, JSON.stringify(chatLog[0]), JSON.stringify(chatLog[1]));
    await redis.expire(`session:${session_id}`, 3600); // TTL 1h

    res.json(chatLog);
  } catch (err) {
    console.error('Gemini error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getHistory = async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: 'Missing session_id' });

  const history = await redis.lRange(`session:${session_id}`, 0, -1);
  const parsed = history.map(h => JSON.parse(h));
  res.json(parsed);
};

const resetSession = async (req, res) => {
  const { session_id } = req.body;
  if (!session_id) return res.status(400).json({ error: 'Missing session_id' });

  await redis.del(`session:${session_id}`);
  res.json({ status: 'Session cleared' });
};

module.exports = { handleQuery, getHistory, resetSession };
