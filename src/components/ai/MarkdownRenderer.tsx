'use client';

import React, { ComponentProps } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github-dark.css';

// Import additional languages for syntax highlighting
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import bash from 'highlight.js/lib/languages/bash';

// Configure rehypeHighlight with our supported languages
const highlightOptions = {
  languages: {
    javascript,
    typescript,
    python,
    java,
    cpp,
    css,
    html: xml,
    bash
  },
  subset: ['javascript', 'typescript', 'python', 'java', 'cpp', 'css', 'html', 'bash']
};

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
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeHighlight, highlightOptions],
          rehypeSanitize
        ]}
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
          table({ node, ...props }) {
            return (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
                  {props.children}
                </table>
              </div>
            );
          },
          th({ node, ...props }) {
            return (
              <th 
                className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left bg-gray-100 dark:bg-gray-800"
                {...props}
              />
            );
          },
          td({ node, ...props }) {
            return (
              <td 
                className="border border-gray-300 dark:border-gray-700 px-4 py-2"
                {...props}
              />
            );
          },
          pre({ children }) {
            return (
              <pre className="rounded-lg bg-gray-900 p-4 overflow-x-auto text-sm">
                {children}
              </pre>
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
