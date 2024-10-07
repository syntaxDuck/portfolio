// src/pages/Home.jsx
import React from 'react';
import Skills from '../components/Skills';
import ContactForm from '../components/ContactForm';

const Home = () => {
  return (
    <div className="home-page">
      <h1>Welcome to My Portfolio</h1>
      <p>
        I'm [Your Name], a [Your Profession]. Explore my projects and read my blog to learn more about me.
      </p>
      <Skills />
      <ContactForm />
    </div>
  );
};

export default Home;
