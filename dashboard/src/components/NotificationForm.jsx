import React, { useState } from 'react';
import axios from 'axios';

const NotificationForm = () => {
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/notifications', { message });
      console.log('Notification posted:', response.data);
    } catch (error) {
      console.error('Error posting notification:', error);
    }
  };

  return (
    <div className="notification-form-container">
      <h2>Create Notification</h2>
      <form className="notification-form" onSubmit={handleSubmit}>
        <label>
          Message:
          <input type="text" value={message} onChange={handleInputChange} />
        </label>
        <button type="submit">Post Notification</button>
      </form>
    </div>
  );
};

export default NotificationForm;
