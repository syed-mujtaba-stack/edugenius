import { notFound } from 'next/navigation';
import { BookOpen, Clock, Users, BarChart3, Code, Database, Cpu, Smartphone, Globe, Lock, Server, Terminal, ArrowLeft, CheckCircle, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Mock course data - in a real app, this would come from an API or database
const getCourseById = (id: string) => {
  const courses = [
    {
      id: 'web-development',
      title: 'Web Development',
      description: 'Master modern web development with HTML, CSS, JavaScript and popular frameworks.',
      longDescription: 'This comprehensive course covers everything you need to become a professional web developer. You\'ll learn the fundamentals of HTML, CSS, and JavaScript, then move on to modern frameworks like React, Next.js, and Node.js. By the end of the course, you\'ll have built several real-world projects to showcase in your portfolio.',
      duration: '8 weeks',
      students: '1.2k+',
      level: 'Beginner',
      icon: <Globe className="w-6 h-6" />,
      category: 'Development',
      instructor: 'Sarah Johnson',
      instructorTitle: 'Senior Web Developer',
      instructorBio: '10+ years of experience in web development. Former lead developer at TechCorp.',
      whatYoullLearn: [
        'Build responsive websites with HTML5 and CSS3',
        'Master JavaScript fundamentals and ES6+ features',
        'Create interactive UIs with React',
        'Build full-stack applications with Node.js and Express',
        'Work with databases like MongoDB and PostgreSQL',
        'Deploy applications to the cloud'
      ],
      curriculum: [
        {
          week: 1,
          title: 'HTML & CSS Fundamentals',
          topics: ['HTML5 Semantic Elements', 'CSS Grid & Flexbox', 'Responsive Design']
        },
        {
          week: 2,
          title: 'JavaScript Basics',
          topics: ['Variables & Data Types', 'Functions & Scope', 'DOM Manipulation']
        },
        // Add more weeks...
      ]
    },
    // Add other courses with similar structure
  ];

  return courses.find(course => course.id === id);
};

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const course = getCourseById(params.courseId);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b">
        <div className="container px-4 md:px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <Link href="/tutorials" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Link>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  {course.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  {course.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  {course.longDescription || course.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    {course.duration}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-2" />
                    {course.students} students
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {course.level}
                  </span>
                </div>
                <Button size="lg" className="gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Start Learning
                </Button>
              </div>
              <div className="md:w-1/3">
                <div className="bg-card border rounded-xl p-6">
                  <h3 className="font-semibold mb-4">This course includes:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>8 hours on-demand video</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>5 coding exercises</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Downloadable resources</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Certificate of completion</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                {/* What You'll Learn */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.whatYoullLearn?.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    )) || (
                      <p>No learning objectives defined for this course.</p>
                    )}
                  </div>
                </section>

                {/* Course Content */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Course Content</h2>
                  <div className="border rounded-lg overflow-hidden">
                    {course.curriculum?.map((week, weekIndex) => (
                      <div key={weekIndex} className="border-b last:border-b-0">
                        <div className="p-4 bg-muted/50">
                          <h3 className="font-medium">Week {week.week}: {week.title}</h3>
                        </div>
                        <div className="p-4 space-y-2">
                          {week.topics.map((topic, topicIndex) => (
                            <div key={topicIndex} className="flex items-center justify-between p-2 hover:bg-muted/30 rounded">
                              <div className="flex items-center gap-3">
                                <PlayCircle className="w-4 h-4 text-muted-foreground" />
                                <span>{topic}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">15 min</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )) || (
                      <div className="p-8 text-center text-muted-foreground">
                        Course curriculum coming soon
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Instructor */}
              <div>
                <div className="sticky top-24">
                  <div className="bg-card border rounded-xl p-6">
                    <h3 className="font-semibold text-lg mb-4">Instructor</h3>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-2xl">{course.instructor?.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{course.instructor || 'Instructor Name'}</h4>
                        <p className="text-sm text-muted-foreground">{course.instructorTitle || 'Instructor Title'}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {course.instructorBio || 'Instructor bio not available.'}
                    </p>
                    <Button variant="outline" className="w-full">
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  // In a real app, this would fetch all course IDs from your database
  return [
    { courseId: 'web-development' },
    // Add other course IDs here for static generation
  ];
}
