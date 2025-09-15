import { BookOpen, Code, Layers, BarChart3, Brain, Shield, Cloud, Layout, Gamepad2 } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  students: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: LucideIcon;
  category: string;
  learningOutcomes?: string[];
  instructor?: {
    name: string;
    role: string;
    bio: string;
    image?: string;
  };
}

export const courses: Course[] = [
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Master modern web development with HTML, CSS, JavaScript and popular frameworks.',
    duration: '10 weeks',
    students: '2.5k+',
    level: 'Beginner',
    icon: Code,
    category: 'Development',
    learningOutcomes: [
      'Build responsive websites using HTML5 and CSS3',
      'Create interactive web applications with JavaScript',
      'Work with modern frameworks like React and Next.js',
      'Implement authentication and database integration',
      'Deploy web applications to production'
    ]
  },
  {
    id: 'python-programming',
    title: 'Python Programming',
    description: 'Learn Python from basics to advanced concepts including OOP and web frameworks.',
    duration: '6 weeks',
    students: '2.1k+',
    level: 'Beginner',
    icon: Code,
    category: 'Development',
    learningOutcomes: [
      'Master Python syntax and data structures',
      'Understand object-oriented programming in Python',
      'Work with files and handle exceptions',
      'Build web applications with Django/Flask',
      'Automate tasks with Python scripts'
    ]
  },
  {
    id: 'data-science',
    title: 'Data Science',
    description: 'Master data analysis, machine learning, and data visualization techniques.',
    duration: '14 weeks',
    students: '1.5k+',
    level: 'Intermediate',
    icon: BarChart3,
    category: 'Data Science',
    learningOutcomes: [
      'Perform data analysis with Python and pandas',
      'Create data visualizations using Matplotlib and Seaborn',
      'Build and evaluate machine learning models',
      'Work with Jupyter Notebooks',
      'Understand statistical concepts for data science'
    ]
  },
  {
    id: 'cyber-security',
    title: 'Cyber Security',
    description: 'Learn to protect systems and networks from digital attacks and threats.',
    duration: '12 weeks',
    students: '1.2k+',
    level: 'Advanced',
    icon: Shield,
    category: 'Security',
    learningOutcomes: [
      'Understand security principles and best practices',
      'Perform vulnerability assessments',
      'Implement security measures and controls',
      'Learn about encryption and cryptography',
      'Handle security incidents and response'
    ]
  },
  {
    id: 'cloud-computing',
    title: 'Cloud Computing',
    description: 'Master cloud platforms like AWS, Azure, and Google Cloud for scalable applications.',
    duration: '10 weeks',
    students: '1.8k+',
    level: 'Intermediate',
    icon: Cloud,
    category: 'Cloud',
    learningOutcomes: [
      'Understand cloud computing concepts and models',
      'Deploy and manage applications on cloud platforms',
      'Work with cloud storage and databases',
      'Implement cloud security best practices',
      'Automate cloud infrastructure'
    ]
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    description: 'Learn to create beautiful and intuitive user interfaces and experiences.',
    duration: '8 weeks',
    students: '1.3k+',
    level: 'Beginner',
    icon: Layout,
    category: 'Design',
    learningOutcomes: [
      'Understand design principles and psychology',
      'Create wireframes and prototypes',
      'Conduct user research and testing',
      'Design for accessibility and inclusivity',
      'Work with design tools like Figma and Sketch'
    ]
  },
  {
    id: 'game-development',
    title: 'Game Development',
    description: 'Create games using Unity and Unreal Engine.',
    duration: '12 weeks',
    students: '1.7k+',
    level: 'Intermediate',
    icon: Gamepad2,
    category: 'Development',
    learningOutcomes: [
      'Learn game design principles',
      'Create 2D and 3D games',
      'Work with game physics and animations',
      'Implement game AI',
      'Publish and market your games'
    ]
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning',
    description: 'Learn to build and deploy machine learning models with Python.',
    duration: '12 weeks',
    students: '1.9k+',
    level: 'Advanced',
    icon: Brain,
    category: 'Data Science',
    learningOutcomes: [
      'Understand machine learning algorithms',
      'Work with TensorFlow and PyTorch',
      'Train and evaluate models',
      'Deploy ML models to production',
      'Work with real-world datasets'
    ]
  }
];

// Helper function to get a course by ID
export function getCourseById(id: string): Course | undefined {
  return courses.find(course => course.id === id);
}

// Helper function to get courses by category
export function getCoursesByCategory(category: string): Course[] {
  return courses.filter(course => course.category === category);
}

// Helper function to get related courses
export function getRelatedCourses(courseId: string, limit = 3): Course[] {
  const course = courses.find(c => c.id === courseId);
  if (!course) return [];
  
  return courses
    .filter(c => c.category === course.category && c.id !== course.id)
    .slice(0, limit);
}
