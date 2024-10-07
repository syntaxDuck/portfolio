// src/components/ProjectCard.jsx
import React from "react";

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <h3>
        <a href={project.html_url} target="_blank" rel="noopener noreferrer">
          {project.name}
        </a>
      </h3>
      <p>{project.description}</p>
      <p>
        ⭐ {project.stargazers_count} | 🍴 {project.forks_count}
      </p>
    </div>
  );
};

export default ProjectCard;
