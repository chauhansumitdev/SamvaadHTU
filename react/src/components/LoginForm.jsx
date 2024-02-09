import React, { useState } from 'react';
import CommonForm from './CommonForm';
import { authRoutes } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { setAuthData } = useAuth();
  const navigate = useNavigate(); 
  const [selectedForm, setSelectedForm] = useState('login');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleLoginSubmit = async (formData) => {
    try {
      if (!formData) {
        console.error('Form data is undefined');
        return;
      }

      const { username, password } = formData;

      if (!username || !password) {
        console.error('Username or password is missing');
        return;
      }

      const data = {
        username,
        password,
      };

      const response = await authRoutes.login(data);
      console.log('Login Response:', response.data);

      setAuthData(response.data.token);
      navigate('/');
    } catch (error) {
      console.error('Login Error:', error.response ? error.response.data : error.message);
    }
  };

  const handleRegisterSubmit = async (formData) => {
    try {
      const response = await authRoutes.register(formData);
      console.log('Register Response:', response.data);
      setRegistrationSuccess(true);
    } catch (error) {
      console.error('Register Error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      {registrationSuccess ? (
        <p>Account created successfully. Now login to continue.</p>
      ) : (
        <div className='selectform'>
          <label>
            Select Form:
            <select value={selectedForm} onChange={(e) => setSelectedForm(e.target.value)}>
              <option value="login">Login</option>
              <option value="register">Register</option>
            </select>
          </label>
          <div>
          {selectedForm === 'login' ? (
            <CommonForm onSubmit={handleLoginSubmit} formType="login" />
          ) : (
            <CommonForm onSubmit={handleRegisterSubmit} formType="register" />
          )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
