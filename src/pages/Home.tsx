import React from 'react';
import Skills from '../components/Skills';
import ContactForm from '../components/ContactForm';
import GithubProjects from '../components/GithubProjects';
import CommitHistoryGraph from '../components/CommitHistoryGraph';
import Terminal from '../components/terminal/Terminal';

const Home = () => {
  return (
    <div id="projects">
      <Terminal />
      <div className="max-w-6xl mx-auto divide-y divide-borderMuted dark:divide-borderMuted">
        <GithubProjects />
        <div id="skills" className="py-12">
          <Skills />
        </div>
        <CommitHistoryGraph />
        <div id="contact" className="py-12">
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default Home;
