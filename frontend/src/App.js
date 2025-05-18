import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatBox from './components/ChatBox';
import MessageInput from './components/MessageInput';
import ResetButton from './components/ResetButton';
import { sendMessage, getHistory } from './api';

function App() {
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let id = localStorage.getItem('sessionId');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('sessionId', id);
    }
    setSessionId(id);
    getHistory(id).then((res) => {
      if(res.data) {
        setMessages(res.data);
      } else {
        setMessages([]);
      }
    });
  }, []);

  const handleSend = async (text) => {
    setLoading(true);
    const res = await sendMessage({ session_id: sessionId, query: text });
    if (Array.isArray(res)) {
      setLoading(false)
      setMessages(prev => [...prev, ...res]);
    } else {
      console.error("Response data is not an array:", res);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-2xl p-6 flex flex-col h-[80vh]">
        <div className="flex-1 overflow-y-auto mb-4">
          <ChatBox messages={messages} loading={loading} />
        </div>
        <MessageInput onSend={handleSend} />
        <ResetButton sessionId={sessionId} />
      </div>
    </div>
  );
}

export default App;
