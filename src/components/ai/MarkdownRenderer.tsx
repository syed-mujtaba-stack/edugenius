'use client';

import React, { ComponentProps } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

type CodeProps = ComponentProps<'code'> & {
  node?: any; // ReactMarkdown passes this but we don't use it directly
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ node, inline, className, children, ...props }: CodeProps) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="relative">
                <div className="absolute right-2 top-1 text-xs text-gray-400">
                  {match[1]}
                </div>
                <code className={className} {...props}>
                  {children}
                </code>
              </div>
            ) : (
              <code className="bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 text-sm" {...props}>
                {children}
              </code>
            );
          },
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 space-y-1 my-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 space-y-1 my-2" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-2"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
