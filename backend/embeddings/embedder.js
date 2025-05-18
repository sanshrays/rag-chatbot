const axios = require('axios');
require('dotenv').config();

const embedText = async (text) => {
  try {
    const res = await axios.post(
      'https://api.jina.ai/v1/embeddings',
      {
        input: [text],
        model: 'jina-embeddings-v2-base-en'
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.JINA_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data.data[0].embedding;
  } catch (err) {
    console.error('Embedding Error:', err?.response?.data || err.message);
    throw err;
  }
};

module.exports = { embedText };
