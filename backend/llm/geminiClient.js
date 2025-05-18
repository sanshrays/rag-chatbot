// backend/llm/geminiClient.js
const axios = require('axios');

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function callGemini(prompt) {
  const response = await axios.post(
    `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
    {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    }
  );

  return response.data.candidates[0]?.content?.parts[0]?.text || 'No response';
}

module.exports = { callGemini };
