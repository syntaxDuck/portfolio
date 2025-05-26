// src/pages/Home.jsx
import React from 'react';
import Skills from '../components/Skills';
import ContactForm from '../components/ContactForm';
import GithubProjects from '../components/GithubProjects';
import CommitHistoryGraph from '../components/CommitHistoryGraph';
import HeroSection from '../components/HeroSection';

const Home = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <GithubProjects />
      <Skills />
      <CommitHistoryGraph />
      <ContactForm />
    </div>
  );
};

export default Home;
