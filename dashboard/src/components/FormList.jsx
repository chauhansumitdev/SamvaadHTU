import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FormList = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get('http://localhost:3000/forms');
        setForms(response.data);
      } catch (error) {
        console.error('Error fetching forms:', error.message);
      }
    };

    fetchForms();
  }, []);

  return (
    <div className="form-list-container">
      <ul className="form-list">
        {forms.map((form) => (
          <li key={form._id} className="form-item">
            <Link to={`/form/${form._id}`} className="form-link">
              {form.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormList;
