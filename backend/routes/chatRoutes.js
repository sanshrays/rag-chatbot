const express = require('express');
const router = express.Router();
const { handleQuery, getHistory, resetSession } = require('../services/geminiService');

router.post('/chat', handleQuery);
router.get('/history', getHistory);
router.post('/reset-session', resetSession);

module.exports = router;
