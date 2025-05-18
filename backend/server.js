const express = require('express');
const app = express();
const cors = require('cors');
const { handleQuery } = require('./services/geminiService.js');
const { initCollection } = require('./vectorstore/qdrantClient.js');
const { default: chalk } = require('chalk');
const port = 3001

app.use(cors());
app.use(express.json());

const log = console.log;

let sessionHistory = {}
app.get('/', (req, res) => {
  res.send('Hello World! This is the ChromaDB API server.');
})
// Route to get message history
app.get('/history', (req, res) => {
  const { session_id } = req.query;
  if (sessionHistory[session_id]) {
    return res.json(sessionHistory[session_id]);
  }
  res.json([]);
});

// Route to handle sending a message
app.post('/send', handleQuery);

// Initialize the collection (optional, depending on your needs)
app.post('/init', async (req, res) => {
  await initCollection();
  res.send({ status: 'Collection Initialized' });
});

app.post('/reset', (req, res) => {
  const { session_id } = req.params;

  // Remove the session history from memory
  if (sessionHistory[session_id]) {
    delete sessionHistory[session_id];
  }

  res.json({ status: 'Session reset successfully' });
});

app.listen(port, () => {
  log(chalk.green(`Server running at http://localhost:${port}`));
});
