import React, { useState } from 'react';
import axios from 'axios';

const MessageSender = () => {
  const [numbers, setNumbers] = useState('');
  const [message, setMessage] = useState('');
  const [resultMessage, setResultMessage] = useState('');

  const handleSendMessages = async () => {
    try {
      const response = await axios.post('http://localhost:3000/send-messages', {
        numbers: numbers.split(',').map((num) => num.trim()),
        message,
      });

      setResultMessage(response.data.message);
    } catch (error) {
      setResultMessage(`Error: ${error.response.data.error}`);
    }
  };

  return (
    <div className="message-sender-container">
      <h2 className="message-sender-title">Message Sender</h2>
      <div className="input-container">
        <label className="label">
          Numbers (comma-separated):
          <input
            type="text"
            value={numbers}
            onChange={(e) => setNumbers(e.target.value)}
            className="input"
          />
        </label>
      </div>
      <div className="input-container">
        <label className="label">
          Message:
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="textarea"
          />
        </label>
      </div>
      <button onClick={handleSendMessages} className="button">
        Send Messages
      </button>
      {resultMessage && <p className="result-message">{resultMessage}</p>}
    </div>
  );
};

export default MessageSender;
