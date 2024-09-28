import React from 'react';

const HomePage = () => {
    console.log('HomePage is rendering');
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Welcome to Our Application!</h1>
      <p>This is the homepage. Use the navigation menu to explore the site.</p>
      <p>Click on "Cafes" to view the list of cafes, or "Employees" to view the employee directory.</p>
    </div>
  );
};

export default HomePage;