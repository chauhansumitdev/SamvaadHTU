import React from 'react';
import NotificationForm from './NotificationForm';
import FormCreator from './FormCreator';
import FormList from './FormList';
import Sms from './Sms';

const Create = () => {
  return (
    <div className="notification-container">
      <div className="top-section">
        <div className="form-container">
          <h3>Create Notification</h3>
            <NotificationForm/>
          
        </div>
        <div className="form-container">
          <h3>Send Bulk SMS</h3>
          <Sms/>
          <form>
          </form>
        </div>
      </div>
      <div className="bottom-section">
        <div className="result-container">
            <h3>Create Form</h3>
                <FormCreator/>
        </div>
        <div className="result-container">
            <h3>Previous Forms</h3>
                <FormList/>
        </div>
      </div>
    </div>
  );
};

export default Create;
