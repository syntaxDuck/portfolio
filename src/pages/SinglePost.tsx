import React from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const post1 = `# My First Blog Post

Welcome to my blog! This is my first post.`;

interface BlogPost {
  title: string;
  date: string;
  content: string;
}

const blogPosts: Record<string, BlogPost> = {
  'my-first-post': {
    title: 'My First Blog Post',
    date: '2023-10-01',
    content: post1,
  },
};

const SinglePost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogPosts[slug] : undefined;

  if (!post) {
    return <h2 className="text-2xl font-bold text-danger">Post not found</h2>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-primary mb-2">{post.title}</h2>
      <p className="text-muted mb-8">{post.date}</p>
      <div className="prose prose-invert prose-blue max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default SinglePost;
