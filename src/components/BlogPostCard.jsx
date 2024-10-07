// src/components/BlogPostCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const BlogPostCard = ({ post }) => {
  const { title, slug, date } = post;
  return (
    <div className="blog-post-card">
      <h3>
        <Link to={`/blog/${slug}`}>{title}</Link>
      </h3>
      <p>{date}</p>
    </div>
  );
};

export default BlogPostCard;
