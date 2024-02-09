import React, { useState } from 'react';
import { otherRoutes } from '../api/api';

const Report = () => {
  const [formData, setFormData] = useState({
    applicationName: '',
    reportingOnBehalfOf: '',
    location: '',
    typeOfReport: '',
    time: '',
    date: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(formData).some((field) => !field)) {
      console.log('Please fill in all required fields');
      return;
    }

    try {
      await otherRoutes.reportForm(formData);
      console.log('Form submitted successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
    }

    setFormData({
      applicationName: '',
      reportingOnBehalfOf: '',
      location: '',
      typeOfReport: '',
      time: '',
      date: '',
      description: '',
    });
  };

  return (
    <div className='reportcomponent'>
      <form onSubmit={handleFormSubmit} className='formcss'>
        <label>
          Applicant Name:
          <input
            type="text"
            name="applicationName"
            value={formData.applicationName}
            onChange={handleChange}
            className='textinputarea'
          />
        </label>
        <br />
        <label>
          Reporting On Behalf Of:
          <input
            type="text"
            name="reportingOnBehalfOf"
            value={formData.reportingOnBehalfOf}
            onChange={handleChange}
            className='textinputarea'
          />
        </label>
        <br />
        <label>
          Type of Report:
          <input
            type="text"
            name="typeOfReport"
            value={formData.typeOfReport}
            onChange={handleChange}
            className='textinputarea'
          />
        </label>
        <br />
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className='textinputarea'
          />
        </label>
        <br />
        <label>
          Time:
          <input
            type="text"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className='textinputarea'
          />
        </label>
        <br />
        <label>
          Date:
          <input
            type="text"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className='textinputarea'
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className='textinputarea'
          />
        </label>
        <br />
        <label>
          Upload Docs:
          <input
            type="file"
            name="uploadDocs"
            onChange={handleChange}
            className='textinputarea'
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Report;
