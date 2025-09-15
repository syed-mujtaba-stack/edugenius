import { DocumentationGuide, DOCUMENTATION_CATEGORIES } from '@/types/docs';

export const documentationGuides: DocumentationGuide[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    category: 'getting-started',
    content: 'Welcome to EduGenius! To get started, create a free account. Once logged in, navigate to the API Settings page from the sidebar and enter your own Google Gemini API key. You can get a free key from Google AI Studio. This is required to use all the AI features. After saving your key, you can explore all the tools from the sidebar!',
    keywords: ['setup', 'account', 'api key'],
    lastUpdated: '2025-09-15'
  },
  {
    id: 'ai-tutor',
    title: 'How to use the AI Tutor?',
    category: 'ai-features',
    content: 'Navigate to the AI Tutor page. Enter the subject or topic you have a question about in the "Topic" field. Then, type your specific question in the text area below and click "Ask". The AI will provide a detailed answer.',
    keywords: ['ai', 'tutor', 'ask question'],
    lastUpdated: '2025-09-15'
  },
  {
    id: 'test-generator',
    title: 'How does the Test Generator work?',
    category: 'ai-features',
    content: 'On the Test Generator page, fill in the form with details like curriculum, subject, topic, difficulty, and number of questions. Choose between "Practice" mode (shows answers) or "Exam" mode (grades you at the end). For exam mode, you can also enable AI proctoring, which uses your webcam to monitor for potential cheating.',
    keywords: ['test', 'exam', 'practice', 'generator'],
    lastUpdated: '2025-09-15'
  },
  {
    id: 'essay-evaluator',
    title: 'How to use the Essay Evaluator?',
    category: 'ai-features',
    content: 'Paste your essay into the text area on the Essay Evaluator page and click "Evaluate My Essay". The AI will give you a score out of 100, detailed feedback on grammar, structure, creativity, and logic, and even provide an improved sample essay for you to learn from.',
    keywords: ['essay', 'writing', 'evaluation', 'feedback'],
    lastUpdated: '2025-09-15'
  },
  {
    id: 'api-integration',
    title: 'How to integrate with external tools?',
    category: 'getting-started',
    content: 'EduGenius provides a RESTful API for integration with other educational tools. You can find the API documentation in the developer settings. Make sure to generate an API key and review the rate limits before starting your integration.',
    keywords: ['api', 'integration', 'developer'],
    lastUpdated: '2025-09-15'
  },
  {
    id: 'troubleshooting',
    title: 'Common Issues and Solutions',
    category: 'troubleshooting',
    content: 'If you encounter any issues, try clearing your browser cache first. For AI-related problems, check if your API key is valid and has sufficient credits. If problems persist, contact our support team with details about the issue and any error messages you\'re seeing.',
    keywords: ['help', 'support', 'error', 'bug'],
    lastUpdated: '2025-09-15'
  }
];

export { DOCUMENTATION_CATEGORIES };
