import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FormRenderer = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/forms/${formId}`);
        setForm(response.data);
      } catch (error) {
        console.error('Error fetching form:', error.message);
      }
    };

    fetchForm();
  }, [formId]);

  const handleFieldChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field.label]: value }));
  };

  const submitFormData = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/submit-form/${formId}`, formData);
      console.log('Form submitted:', response.data);
    } catch (error) {
      console.error('Error submitting form data:', error.message);
    }
  };

  if (!form) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{form.title}</h2>
      {form.fields.map((field, index) => (
        <div key={index}>
          <label>{field.label}:</label>
          {field.type === 'text' ? (
            <input
              type="text"
              value={formData[field.label] || ''}
              onChange={(e) => handleFieldChange(field, e.target.value)}
            />
          ) : field.type === 'checkbox' ? (
            <input
              type="checkbox"
              checked={formData[field.label] || false}
              onChange={(e) => handleFieldChange(field, e.target.checked)}
            />
          ) : null}
        </div>
      ))}
      <button onClick={submitFormData}>Submit Form</button>
    </div>
  );
};

export default FormRenderer;
