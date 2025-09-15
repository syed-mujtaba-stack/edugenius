export type DocumentationCategory = 'getting-started' | 'ai-features' | 'account' | 'troubleshooting';

export interface DocumentationGuide {
  id: string;
  title: string;
  content: string;
  category: DocumentationCategory;
  keywords: string[];
  lastUpdated: string;
}

export const DOCUMENTATION_CATEGORIES: readonly DocumentationCategory[] = [
  'getting-started',
  'ai-features',
  'account',
  'troubleshooting'
] as const;
