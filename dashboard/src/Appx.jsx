import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FormList from './components/FormList';
import FormRenderer from './components/FormRenderer';
import FormCreator from './components/FormCreator'

function App() {
  return (
    <Router>
      <div className="App">
        <FormCreator></FormCreator>
        <Link to="/forms">Forms</Link>
        <Routes>
          <Route path="/forms" element={<FormList />} />
          <Route path="/form/:formId" element={<FormRenderer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;