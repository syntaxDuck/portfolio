import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getPostBySlug } from '../lib/posts';

const SinglePost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-2xl font-bold text-danger">Post not found</h2>
        <Link to="/blog" className="text-primary dark:text-primary-dark hover:underline mt-4 inline-block">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link 
        to="/blog" 
        className="text-muted dark:text-muted-dark hover:text-primary dark:hover:text-primary-dark transition-colors mb-8 inline-block"
      >
        ← Back to Blog
      </Link>
      
      <h2 className="text-3xl font-bold text-primary dark:text-primary-dark mb-2">
        {post.title}
      </h2>
      
      <p className="text-muted dark:text-muted-dark mb-8">
        {post.date}
        {post.tags && post.tags.length > 0 && (
          <span className="ml-2">
            {' • '}
            {post.tags.map(tag => (
              <span key={tag} className="ml-2 px-2 py-1 text-xs bg-bg2 dark:bg-bg2-dark border border-borderMuted rounded-sm">
                {tag}
              </span>
            ))}
          </span>
        )}
      </p>

      {post.description && (
        <p className="text-lg text-muted dark:text-muted-dark mb-8 pb-8 border-b border-borderMuted">
          {post.description}
        </p>
      )}
      
      <article className="prose prose-invert prose-blue dark:prose-invert max-w-none prose-headings:text-primary dark:prose-headings:text-primary-dark prose-a:text-primary dark:prose-a:text-primary-dark prose-code:text-secondary dark:prose-code:text-secondary-dark">
        <ReactMarkdown
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const inline = !match;
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-sm border border-borderMuted"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-bg2 dark:bg-bg2-dark px-1 py-0.5 rounded-sm text-sm" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </article>
    </div>
  );
};

export default SinglePost;
