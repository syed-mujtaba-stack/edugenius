
import { DocumentationClient } from './documentation-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation - EduGenius',
  description: 'Learn how to use EduGenius with our comprehensive documentation.',
  openGraph: {
    title: 'Documentation - EduGenius',
    description: 'Learn how to use EduGenius with our comprehensive documentation.',
    type: 'website',
  },
};

export default function DocsPage() {
  return <DocumentationClient />;
}
