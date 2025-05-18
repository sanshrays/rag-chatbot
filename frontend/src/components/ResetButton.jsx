import React from 'react';
import { resetSession } from '../api.js';

const ResetButton = ({ sessionId }) => {
  const handleReset = async () => {
    await resetSession(sessionId);
    localStorage.removeItem('sessionId');
    window.location.reload();
  };

  return (
    <button
      onClick={handleReset}
      className="mt-4 text-sm text-red-500 hover:underline"
    >
      Reset Chat
    </button>
  );
};

export default ResetButton;
