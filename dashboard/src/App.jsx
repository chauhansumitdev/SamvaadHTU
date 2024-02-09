import React from 'react';
import AppRoutes from './routes/AppRoutes';
import Sidebar from './components/Sidebar';

function App() {
  return (
      <div className="App">
        <div className="sidebar">
            <Sidebar/>
        </div>
        <div className="content">
          <AppRoutes />
        </div>
      </div>
  );
}

export default App;
