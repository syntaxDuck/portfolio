import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface BlogPost {
  title: string;
  slug: string;
  date: string;
}

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const { title, slug, date } = post;
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-bg2 dark:bg-bg2-dark border border-borderMuted dark:border-borderMuted rounded-sm p-5 hover:border-primary dark:hover:border-primary transition-colors"
    >
      <h3 className="text-lg font-semibold mb-2">
        <Link
          to={`/blog/${slug}`}
          className="text-primary dark:text-primary-dark hover:text-primary/80 dark:hover:text-primary-dark/80 transition-colors"
        >
          {title}
        </Link>
      </h3>
      <p className="text-muted dark:text-muted-dark text-sm">{date}</p>
    </motion.div>
  );
};

export default BlogPostCard;
