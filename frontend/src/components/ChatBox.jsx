import React from 'react';

const ChatBox = ({ messages, loading }) => {
  if (loading) {
    // Show loading skeletons while data is being fetched
    return (
      <div className="space-y-4 max-h-200 overflow-y-auto p-4 bg-white rounded shadow mb-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse space-y-2">
            <div className="flex justify-end">
              <div className="bg-blue-100 h-4 w-24 rounded"></div>
            </div>
            <div className="flex justify-start">
              <div className="bg-gray-100 h-4 w-48 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (!messages || messages.length === 0) {
    return <p className="text-center text-gray-500">No messages yet.</p>;
  }

  return (
    <div className="space-y-4 max-h-200 overflow-y-auto p-4 bg-white rounded shadow mb-4">
      {messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'}`}>
            <p className="text-xs text-gray-500 mb-1">{msg.role === 'user' ? 'You' : 'Bot'}</p>
            <div>{msg.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
