import React, { useState } from 'react';
import axios from 'axios';

const FormBuilder = () => {
  const [form, setForm] = useState({
    title: '',
    fields: [],
  });

  const addField = () => {
    setForm((prevForm) => ({
      ...prevForm,
      fields: [...prevForm.fields, { label: '', type: 'text' }],
    }));
  };

  const handleFieldChange = (index, key, value) => {
    setForm((prevForm) => {
      const newFields = [...prevForm.fields];
      newFields[index][key] = value;
      return { ...prevForm, fields: newFields };
    });
  };

  const submitForm = async () => {
    try {
      const response = await axios.post('http://localhost:3000/submit-form', form);
      console.log('Form submitted:', response.data);
    } catch (error) {
      console.error('Error submitting form:', error.message);
    }
  };

  return (
    <div className="form-builder-container">
      <label>Title:</label>
      <input
        type="text"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <button className="add-field-btn" onClick={addField}>
        Add Field
      </button>
      {form.fields.map((field, index) => (
        <div key={index} className="form-field">
          <label>Label:</label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
          />
          <label>Type:</label>
          <select
            value={field.type}
            onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
          >
            <option value="text">Text</option>
            <option value="checkbox">Checkbox</option>
          </select>
        </div>
      ))}
      <button className="submit-form-btn" onClick={submitForm}>
        Submit Form
      </button>
    </div>
  );
};

export default FormBuilder;
