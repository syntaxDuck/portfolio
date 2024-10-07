// src/pages/Blog.jsx
import React from 'react';
import BlogPostCard from '../components/BlogPostCard';
import post1 from '../blog/my-first-post.md';

const blogPosts = [
  {
    title: 'My First Blog Post',
    slug: 'my-first-post',
    date: '2023-10-01',
    content: post1,
  },
];

const Blog = () => {
  return (
    <div className="blog-page">
      <h2>My Blog</h2>
      <div className="blog-posts-list">
        {blogPosts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Blog;
