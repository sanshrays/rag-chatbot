import React, { useState } from 'react';

const MessageInput = ({ onSend }) => {
  const [input, setInput] = useState('');

  const send = () => {
    if (input.trim() !== '') {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') send();
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        className="flex-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        placeholder="Ask something..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={send}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
