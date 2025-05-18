import axios from 'axios';

const BASE_URL = 'https://rag-chatbot-nexl.onrender.com';

// Function to send a message
export const sendMessage = async ({ session_id, query }) => {
  debugger
  try {
    const response = await axios.post(`${BASE_URL}/send`, { session_id, query });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    return [];
  }
};

// Function to get the history of messages
export const getHistory = async (session_id) => {
  try {
    const response = await axios.get(`${BASE_URL}/history`, {
      params: { session_id }
    });
    return response.data;
  } catch (error) {
    console.error("Error getting message history:", error);
    return [];
  }
};

export const resetSession = async (session_id) => {
  try {
    const response = await axios.post(`${BASE_URL}/reset`, { session_id });
    return response.data;
  } catch (error) {
    console.error("Error resetting session:", error);
    return [];
  }
}
