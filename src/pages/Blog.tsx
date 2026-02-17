import React from 'react';
import BlogPostCard from '../components/BlogPostCard';
import { getAllPosts } from '../lib/posts';

const Blog = () => {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-primary dark:text-primary-dark mb-8 border-l-4 border-primary dark:border-primary-dark pl-4">My Blog</h2>
      {posts.length === 0 ? (
        <p className="text-muted dark:text-muted-dark">No posts yet. Check back soon!</p>
      ) : (
        <div className="grid divide-y divide-borderMuted dark:divide-borderMuted">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
