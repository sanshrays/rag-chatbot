# RAG-Chatbot Backend

This is the backend service for the RAG-Chatbot project. It provides REST APIs for a Retrieval-Augmented Generation (RAG) chatbot that leverages vector search (Qdrant), embeddings (Jina), Google Gemini LLM, and Redis for session management.

## Features

- REST API for chat, history, and session reset
- Vector search using Qdrant for context retrieval
- Embeddings generated via Jina AI
- LLM integration with Google Gemini
- Session management using Redis
- Article ingestion from RSS feeds or static lists

## Project Structure
backend/ │ ├── .env # Environment variables ├── server.js # Main Express server ├── package.json ├── redisClient.js # Redis connection and helpers ├── insertDataToQdrant.js # Script to insert static data to Qdrant │ ├── embeddings/ │ └── embedder.js # Jina embedding logic ├── llm/ │ └── geminiClient.js # Gemini API client ├── routes/ │ ├── chat.js # (Legacy) Chat route │ └── chatRoutes.js # (Legacy) Chat route definitions ├── scripts/ │ └── ingest.js # RSS ingestion and indexing script ├── services/ │ └── geminiService.js # Main chat logic and API handlers ├── vectorstore/ │ └── qdrantClient.js # Qdrant vector DB client


## Setup

1. **Install dependencies:**
   ```sh
   npm install

2. **Configure environment variables: Create a .env file with the following keys:**
QDRANT_URL=...
QDRANT_API_KEY=...
COLLECTION_NAME=news_articles_new
EMBEDDING_DIM=768
JINA_API_KEY=...
...
GEMINI_API_KEY=   REDIS_REST_TOKEN=...

3. **Start the backend server:**
npm start

4. **(Optional) Ingest articles:**
To ingest RSS articles: node scripts/ingest.js
To insert static data: node insertDataToQdrant.js

5. **API Endpoints**
GET /
Health check.

POST /send
Send a user query and get a response.

Body: { "session_id": "uuid", "query": "Your question" }

GET /history?session_id=uuid
Get chat history for a session.

POST /reset
Reset a chat session.

Body: { "session_id": "uuid" }

6. **Development**
Uses nodemon for auto-reloading.
Main logic in services/geminiService.js.
Vector DB logic in vectorstore/qdrantClient.js.