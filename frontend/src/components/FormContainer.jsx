import React from 'react';

const FormContainer = ({ children }) => (
  <div className="container mt-4">
    <div className="card">
      <div className="card-body">
        {children}
      </div>
    </div>
  </div>
);

export default FormContainer;