import React, { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import { otherRoutes } from '../api/api'; 


const FormRenderer = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await otherRoutes.getForm(formId);
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
      const response = await otherRoutes.submitForm(formId, formData);
      console.log('Form submitted:', response.data);
    } catch (error) {
      console.error('Error submitting form data:', error.message);
    }
  };
  

  if (!form) {
    return <div>Loading...</div>;
  }

  return (
    <div className='formrenderer'>
      <h4>{form.title}</h4>
      {form.fields.map((field, index) => (
        <div key={index} >
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
