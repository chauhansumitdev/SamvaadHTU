import logo from '../assets/home.png';
import React, { useState } from 'react';
import { otherRoutes } from '../api/api';

const EmergencyInApp = () => {
  const [emergencyDetails, setEmergencyDetails] = useState({
    emergencyType: '',
    contactNumber: '',
    registrationNumber: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmergencyDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await otherRoutes.emergency(emergencyDetails);
    } catch (error) {
      console.error('Error submitting emergency data:', error);
    }
  };

  return (
    <div className="emergency-form-container">
      <div className="app-logo">
        <img src={logo} alt="App Logo" />
      </div>

      <form className="emergency-form postcomponent" onSubmit={handleSubmit}>
        <h4>Emergency Form</h4>

        <div className="form-field">
          <label>Emergency Type:</label>
          <select
            name="emergencyType"
            value={emergencyDetails.emergencyType}
            onChange={handleInputChange}
          >
            <option value="">Select an option</option>
            <option value="medical">Medical Emergency</option>
            <option value="fire">Fire Emergency</option>
            <option value="police">Police Emergency</option>
            <option value="police">Others</option>
          </select>
        </div>

        <div className="form-field">
          <label>Contact Number:</label>
          <input
            type="text"
            name="contactNumber"
            value={emergencyDetails.contactNumber}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-field">
          <label>Description</label>
          <input
            type="text"
            name="registrationNumber"
            value={emergencyDetails.registrationNumber}
            onChange={handleInputChange}
          />
        </div>

          <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EmergencyInApp;
