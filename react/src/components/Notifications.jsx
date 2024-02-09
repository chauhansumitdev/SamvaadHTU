import { useAuth } from '../context/AuthContext';
import FormList from "./FormList";
import { otherRoutes } from '../api/api';
import React, { useState, useEffect } from 'react';


const Notifications = () => {

  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchProfileNotifs = async () => {
      try {
        const response = await otherRoutes.notifications();
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching profile notifs:', error);
      }
    };

    fetchProfileNotifs();
  }, []);



  return (
    <>
    <div className='postcomponent'>
    <h4>Notifications</h4>
    <div className="notification-container">
      {notifications.map((notification) => (
        <div key={notification._id} className="notification">
          <div className="notification-message">{notification.message}</div>
          <div className="notification-timestamp">{new Date(notification.timestamp).toLocaleString()}</div>
        </div>
      ))}
    </div>
    {token?(<>
      <h4>Police Feedback</h4>
        <div className="policefeedback">
          <div className="notification-container">
            <FormList/>
          </div>
        </div>
    </>
    ):(
    <>
    <p>Login To See Police Feedback Forms</p>
    </>)}
    </div>
    </>
  );
};

export default Notifications;
