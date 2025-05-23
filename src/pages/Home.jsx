// src/pages/Home.jsx
import React from 'react';
import Skills from '../components/Skills';
import ContactForm from '../components/ContactForm';
import GithubProjects from '../components/GithubProjects';
import CommitHistoryGraph from '../components/CommitHistoryGraph';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero section at the very top */}
      <GithubProjects />
      <h1>Welcome to My Portfolio</h1>
      <p>
        I'm [Your Name], a [Your Profession]. Explore my projects and read my blog to learn more about me.
      </p>
      {/* Shift Skills section down */}
      <Skills />
      <CommitHistoryGraph />
      <ContactForm />
    </div>
  );
};

export default Home;
