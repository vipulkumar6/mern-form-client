import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductRegistrationForm from './ProductRegistration';
import SubmittedData from './SubmittedData';
import { NextUIProvider } from "@nextui-org/react";

const App = () => {
  return (
    <NextUIProvider>

      <Router>
        <Routes>
          <Route path="/" element={<ProductRegistrationForm />} />
          <Route path="/submitted-data" element={<SubmittedData />} />
        </Routes>
      </Router>
    </NextUIProvider>

  );
};

export default App;


