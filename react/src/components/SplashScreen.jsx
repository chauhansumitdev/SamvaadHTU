import React from 'react';
import logo from '../assets/home.png'; 

const SplashScreen = () => {
  return (
    <div className="splash-screen">
      <img src={logo} alt="App Logo" className="logo" />
    </div>
  );
};

export default SplashScreen;
