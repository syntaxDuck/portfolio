import React from 'react';
import Skills from '../components/Skills';
import ContactForm from '../components/ContactForm';
import GithubProjects from '../components/GithubProjects';
import CommitHistoryGraph from '../components/CommitHistoryGraph';
import HeroSection from '../components/HeroSection';

const Home = () => {
  return (
    <div id="projects">
      <HeroSection />
      <div className="max-w-6xl mx-auto">
        <GithubProjects />
        <div id="skills" className="my-12">
          <Skills />
        </div>
        <CommitHistoryGraph />
        <div id="contact" className="my-12">
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default Home;
