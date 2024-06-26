import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
      // If authentication token is not found, redirect to login page
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      <h1 style={{ marginTop: '4rem' }}>This is about page</h1>
    </div>
  );
};

export default About;
