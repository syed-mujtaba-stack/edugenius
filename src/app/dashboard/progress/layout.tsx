import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Progress - EduGenius',
  description: 'Track your learning progress, achievements, and see how you rank among other learners.',
};

export default function ProgressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
