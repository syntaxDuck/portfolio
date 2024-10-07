// src/pages/SinglePost.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import post1 from '../blog/my-first-post.md';

const blogPosts = {
  'my-first-post': {
    title: 'My First Blog Post',
    date: '2023-10-01',
    content: post1,
  },
};

const SinglePost = () => {
  const { slug } = useParams();
  const post = blogPosts[slug];

  if (!post) {
    return <h2>Post not found</h2>;
  }

  return (
    <div className="single-post-page">
      <h2>{post.title}</h2>
      <p>{post.date}</p>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </div>
  );
};

export default SinglePost;
