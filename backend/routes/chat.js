// backend/routes/chat.js
const express = require('express');
const { embedText } = require('../embeddings/embedder');
const { queryVectors } = require('../vectorstore/chromaClient');
const { callGemini } = require('../llm/geminiClient');
const router = express.Router();

router.post('/chat', async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || !sessionId) {
    return res.status(400).json({ error: 'Missing message or sessionId' });
  }

  try {
    // 1. Embed the query
    const queryEmbedding = await embedText(message);

    // 2. Retrieve top-k similar articles
    const results = await queryVectors(queryEmbedding, 5);
    const docs = results.documents[0] || [];

    const context = docs.join('\n---\n');

    // 3. Call Gemini
    const finalPrompt = `
You're a helpful news chatbot. Answer the question based on the context.

Context:
${context}

User: ${message}
Chatbot:
    `;

    const answer = await callGemini(finalPrompt);

    res.json({
      sessionId,
      answer,
      sources: results.metadatas[0] || [],
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
