import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LuClipboardEdit } from "react-icons/lu";
import { otherRoutes } from '../api/api'; 



const FormList = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await otherRoutes.getFormsList();
        setForms(response.data);
      } catch (error) {
        console.error('Error fetching forms:', error.message);
      }
    };

    fetchForms();
  }, []);

  return (
    <div>
      <div>
        {forms.map((form) => (
          <div key={form._id} className="notification">
            <LuClipboardEdit style={{marginRight:"10px"}}/>
            <Link to={`/form/${form._id}`}>{form.title}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormList;