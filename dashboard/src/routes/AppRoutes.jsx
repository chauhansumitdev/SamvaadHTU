import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../components/Home';
import Create from '../components/Create';
import FormRenderer from '../components/FormRenderer';
import Responses from '../components/Responses';
import Activity from '../components/Activity';
import Analytics from '../components/Analytics';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<Create />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/responses" element={<Responses />} />
      <Route path="/form/:formId" element={<FormRenderer />} />
      <Route path="/activity" element={<Activity />} />
    </Routes>
  );
};

export default AppRoutes;
