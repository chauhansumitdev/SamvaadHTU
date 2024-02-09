import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Responses = () => {
  const [yourFormData, setYourFormData] = useState([]);
  const [emergencyData, setEmergencyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/combinedData');
        setYourFormData(response.data.yourFormData);
        setEmergencyData(response.data.emergencyData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="combined-data-container">
      <div className="your-form-data">
        <h2>Your Form Data</h2>
        <ul>
          {yourFormData.map((formData) => (
            <li key={formData._id} className="form-data-item">
              <p>Application Name: {formData.applicationName}</p>
              <p>Reporting On Behalf Of: {formData.reportingOnBehalfOf}</p>
              <p>Location: {formData.location}</p>
              <p>Type of Report: {formData.typeOfReport}</p>
              <p>Time: {formData.time}</p>
              <p>Date: {formData.date}</p>
              <p>Description: {formData.description}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="emergency-data">
        <h2>Emergency Data</h2>
        <ul>
          {emergencyData.map((emergency) => (
            <li key={emergency._id} className="emergency-item">
              <p>Emergency Type: {emergency.emergencyType}</p>
              <p>Contact Number: {emergency.contactNumber}</p>
              <p>Registration number: {emergency.registrationNumber}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Responses;
