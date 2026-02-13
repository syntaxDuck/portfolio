import React from 'react';
import BlogPostCard from '../components/BlogPostCard';

const post1 = `# My First Blog Post

Welcome to my blog! This is my first post.`;

interface BlogPost {
  title: string;
  slug: string;
  date: string;
  content: string;
}

const blogPosts: BlogPost[] = [
  {
    title: 'My First Blog Post',
    slug: 'my-first-post',
    date: '2023-10-01',
    content: post1,
  },
];

const Blog = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-primary mb-8">My Blog</h2>
      <div className="grid gap-6">
        {blogPosts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Blog;
