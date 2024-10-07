// src/components/Skills.jsx
import React from 'react';

const skills = [
  'JavaScript',
  'React',
  'Node.js',
  'CSS',
  'HTML',
  'Git',
  // Add more skills as needed
];

const Skills = () => {
  return (
    <div className="skills-section">
      <h3>My Skills</h3>
      <ul>
        {skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </div>
  );
};

export default Skills;
