import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import SplashScreen from './components/SplashScreen';
import App from './App';
import EmergencyForm from './components/EmergencyForm';
import './index.css';
import { BrowserRouter as Router} from 'react-router-dom'

const Root = document.getElementById('root');

const RootComponent = () => {
  const [showSplash, setShowSplash] = useState(false);
  const [emergencySubmitted, setEmergencySubmitted] = useState(false);
  const timeoutRef = useRef(null);

  const handleEmergencySubmit = () => {
    setEmergencySubmitted(true);
  };

  const handleSkipEmergencyForm = () => {
    setEmergencySubmitted(true);
  };

  useEffect(() => {
    if (emergencySubmitted) {
      timeoutRef.current = setTimeout(() => {
        setShowSplash(true);
      }, 2000);

      return () => clearTimeout(timeoutRef.current);
    }
  }, [emergencySubmitted]);

  return (
    <>
      {emergencySubmitted ? (
        <>
          {showSplash ? (
            <Router>
              <App />
            </Router>
          ) : (
            <SplashScreen />
          )}
        </>
      ) : (
        <EmergencyForm
          onContinue={handleEmergencySubmit}
          onSkip={handleSkipEmergencyForm}
        />
      )}
    </>
  );
};

ReactDOM.createRoot(Root).render(<RootComponent />);
