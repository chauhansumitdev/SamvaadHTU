import React from 'react';
import TopNavbar from './components/TopNavbar';
import BottomIcons from './components/BottomIcons';
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext';


const App = () => {
  return (
    <AuthProvider>
    <div className="mainFrame">
      <TopNavbar />
      <div className="buffer"></div>
      <AppRouter/>
      <BottomIcons />
    </div>
    </AuthProvider>
  );
};

export default App;
