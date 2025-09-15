'use client';

import { BookOpen, Clock, Users, BarChart3, Code, Database, Cpu, Smartphone, Globe, Lock, Server, Terminal, Layers, Brain, Bot, Cloud, Shield, Bitcoin, Layout, Gamepad2 } from 'lucide-react';
import { CourseSearch } from './_components/course-search';
import { CourseGrid } from './_components/course-grid';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';

type Course = {
  id: string;
  title: string;
  description: string;
  duration: string;
  students: string;
  level: string;
  icon: React.ReactNode;
  category: string;
};

const courses: Course[] = [
  // Development
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Master modern web development with HTML, CSS, JavaScript and popular frameworks.',
    duration: '8 weeks',
    students: '1.2k+',
    level: 'Beginner',
    icon: <Globe className="w-6 h-6" />,
    category: 'Development'
  },
  {
    id: 'mobile-app-development',
    title: 'Mobile App Development',
    description: 'Build cross-platform mobile applications using React Native and Flutter.',
    duration: '10 weeks',
    students: '850+',
    level: 'Intermediate',
    icon: <Smartphone className="w-6 h-6" />,
    category: 'Development'
  },
  {
    id: 'python-programming',
    title: 'Python Programming',
    description: 'Learn Python from basics to advanced concepts including OOP and web frameworks.',
    duration: '6 weeks',
    students: '2.1k+',
    level: 'Beginner',
    icon: <Code className="w-6 h-6" />,
    category: 'Development'
  },
  {
    id: 'full-stack-development',
    title: 'Full Stack Development',
    description: 'Master both frontend and backend development with MERN stack.',
    duration: '12 weeks',
    students: '1.1k+',
    level: 'Intermediate',
    icon: <Layers className="w-6 h-6" />,
    category: 'Development'
  },
  // Data Science & AI
  {
    id: 'data-science',
    title: 'Data Science',
    description: 'Master data analysis, machine learning, and data visualization techniques.',
    duration: '14 weeks',
    students: '1.5k+',
    level: 'Intermediate',
    icon: <BarChart3 className="w-6 h-6" />,
    category: 'Data Science'
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning',
    description: 'Learn to build and deploy machine learning models with Python.',
    duration: '12 weeks',
    students: '1.3k+',
    level: 'Advanced',
    icon: <Brain className="w-6 h-6" />,
    category: 'Data Science'
  },
  {
    id: 'ai-fundamentals',
    title: 'AI Fundamentals',
    description: 'Introduction to Artificial Intelligence concepts and applications.',
    duration: '8 weeks',
    students: '980+',
    level: 'Beginner',
    icon: <Bot className="w-6 h-6" />,
    category: 'Data Science'
  },
  // Cloud & DevOps
  {
    id: 'cloud-computing',
    title: 'Cloud Computing',
    description: 'Learn cloud platforms like AWS, Azure, and Google Cloud for scalable solutions.',
    duration: '10 weeks',
    students: '950+',
    level: 'Intermediate',
    icon: <Server className="w-6 h-6" />,
    category: 'Cloud'
  },
  {
    id: 'devops',
    title: 'DevOps Engineering',
    description: 'Master CI/CD, Docker, Kubernetes, and infrastructure as code.',
    duration: '12 weeks',
    students: '720+',
    level: 'Advanced',
    icon: <Terminal className="w-6 h-6" />,
    category: 'Cloud'
  },
  {
    id: 'aws-certification',
    title: 'AWS Certification',
    description: 'Prepare for AWS Certified Solutions Architect certification.',
    duration: '8 weeks',
    students: '1.1k+',
    level: 'Intermediate',
    icon: <Cloud className="w-6 h-6" />,
    category: 'Cloud'
  },
  // Security
  {
    id: 'cyber-security',
    title: 'Cyber Security',
    description: 'Learn to protect systems and networks from digital attacks and threats.',
    duration: '12 weeks',
    students: '650+',
    level: 'Advanced',
    icon: <Lock className="w-6 h-6" />,
    category: 'Security'
  },
  {
    id: 'ethical-hacking',
    title: 'Ethical Hacking',
    description: 'Learn penetration testing and ethical hacking techniques.',
    duration: '10 weeks',
    students: '580+',
    level: 'Advanced',
    icon: <Shield className="w-6 h-6" />,
    category: 'Security'
  },
  // New Categories
  {
    id: 'blockchain-development',
    title: 'Blockchain Development',
    description: 'Build decentralized applications with Ethereum and Solidity.',
    duration: '10 weeks',
    students: '420+',
    level: 'Intermediate',
    icon: <Bitcoin className="w-6 h-6" />,
    category: 'Emerging Tech'
  },
  {
    id: 'iot-fundamentals',
    title: 'IoT Fundamentals',
    description: 'Introduction to Internet of Things and embedded systems.',
    duration: '8 weeks',
    students: '350+',
    level: 'Beginner',
    icon: <Cpu className="w-6 h-6" />,
    category: 'Emerging Tech'
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    description: 'Master user interface and experience design principles.',
    duration: '8 weeks',
    students: '890+',
    level: 'Beginner',
    icon: <Layout className="w-6 h-6" />,
    category: 'Design'
  },
  {
    id: 'game-development',
    title: 'Game Development',
    description: 'Create games using Unity and Unreal Engine.',
    duration: '12 weeks',
    students: '670+',
    level: 'Intermediate',
    icon: <Gamepad2 className="w-6 h-6" />,
    category: 'Development'
  },
  // Additional Development Courses
  {
    id: 'typescript-mastery',
    title: 'TypeScript Mastery',
    description: 'Master TypeScript for scalable JavaScript applications.',
    duration: '6 weeks',
    students: '890+',
    level: 'Intermediate',
    icon: <Code className="w-6 h-6" />,
    category: 'Development'
  },
  {
    id: 'react-native-advanced',
    title: 'React Native Advanced',
    description: 'Build production-ready mobile apps with React Native.',
    duration: '8 weeks',
    students: '720+',
    level: 'Advanced',
    icon: <Smartphone className="w-6 h-6" />,
    category: 'Development'
  },
  // Additional Data Science Courses
  {
    id: 'deep-learning',
    title: 'Deep Learning',
    description: 'Advanced neural networks and deep learning architectures.',
    duration: '14 weeks',
    students: '540+',
    level: 'Advanced',
    icon: <Brain className="w-6 h-6" />,
    category: 'Data Science'
  },
  // Additional Cloud Courses
  {
    id: 'google-cloud',
    title: 'Google Cloud Platform',
    description: 'Master GCP services and cloud architecture.',
    duration: '10 weeks',
    students: '620+',
    level: 'Intermediate',
    icon: <Cloud className="w-6 h-6" />,
    category: 'Cloud'
  },
  // Additional Security Courses
  {
    id: 'network-security',
    title: 'Network Security',
    description: 'Secure network infrastructure and prevent cyber attacks.',
    duration: '10 weeks',
    students: '480+',
    level: 'Advanced',
    icon: <Shield className="w-6 h-6" />,
    category: 'Security'
  },
  // Additional Design Courses
  {
    id: 'figma-masterclass',
    title: 'Figma Masterclass',
    description: 'Professional UI/UX design using Figma.',
    duration: '6 weeks',
    students: '1.1k+',
    level: 'Beginner',
    icon: <Layout className="w-6 h-6" />,
    category: 'Design'
  },
  // Additional Emerging Tech Courses
  {
    id: 'metaverse-development',
    title: 'Metaverse Development',
    description: 'Build immersive 3D experiences for the metaverse.',
    duration: '12 weeks',
    students: '320+',
    level: 'Advanced',
    icon: <Globe className="w-6 h-6" />,
    category: 'Emerging Tech'
  }
];

const categories = [
  { name: 'All', value: 'all' },
  { name: 'Development', value: 'Development' },
  { name: 'Data Science', value: 'Data Science' },
  { name: 'Cloud & DevOps', value: 'Cloud' },
  { name: 'Security', value: 'Security' },
  { name: 'Design', value: 'Design' },
  { name: 'Emerging Tech', value: 'Emerging Tech' },
];

export default function TutorialsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Filter courses based on search query and category
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = searchQuery === '' || 
                          course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Handle search changes from child component
  const handleSearchChange = (query: string, category: string) => {
    setSearchQuery(query);
    setSelectedCategory(category);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="w-full py-20 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Explore Our IT Courses
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Master in-demand tech skills with our comprehensive courses designed by industry experts.
            </p>
            
            <CourseSearch 
              categories={categories} 
              onSearchChangeAction={handleSearchChange}
            />
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <CourseGrid 
            courses={filteredCourses}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onClearFiltersAction={handleClearFilters}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Can't find what you're looking for?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're constantly adding new courses. Let us know what you'd like to learn next!
          </p>
          <Button size="lg" className="px-8">
            Request a Course
          </Button>
        </div>
      </section>
    </div>
  );
}
