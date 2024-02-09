import React, { useState } from 'react';

const CommonForm = ({ onSubmit, formType }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    adhaarnumber: '',
    mobilenumber: '',
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='formcss'>
      <h4>{formType === 'login' ? 'Login' : 'Register'}</h4>
      <label>
        Username:
        <input type="text" name="username" value={formData.username} onChange={handleChange} className='textinputarea'/>
      </label>
      <label>
        Password:
        <input type="password" name="password" value={formData.password} onChange={handleChange} className='textinputarea'/>
      </label>
      {formType === 'register' && (
        <>
          <label>
            First Name:
            <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} className='textinputarea'/>
          </label>
          <label>
            Last Name:
            <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} className='textinputarea'/>
          </label>
          <label>
            Aadhar Number:
            <input type="text" name="adhaarnumber" value={formData.adhaarnumber} onChange={handleChange} className='textinputarea'/>
          </label>
          <label>
            Mobile Number:
            <input type="text" name="mobilenumber" value={formData.mobilenumber} onChange={handleChange} className='textinputarea'/>
          </label>
          <label>
            Confirm Password:
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className='textinputarea'
            />
          </label>
        </>
      )}
      <button type="submit">{formType === 'login' ? 'Login' : 'Register'}</button>
    </form>
  );
};

export default CommonForm;
