import { notFound } from 'next/navigation';
import { courses } from '@/lib/courses';
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Users, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function CoursePage({ params }: { params: { courseId: string } }) {
  const course = courses.find(c => c.id === params.courseId);
  
  if (!course) {
    notFound();
  }

  const relatedCourses = courses
    .filter(c => c.category === course.category && c.id !== course.id)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/tutorials" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
        </Button>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-card rounded-xl p-6 shadow-sm border">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {course.icon && React.createElement(course.icon, { className: 'w-10 h-10' })}
                </div>
                <span className="text-sm text-muted-foreground">{course.level}</span>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.students} students</span>
                </div>
              </div>
              
              <Button size="lg" className="w-full">
                Enroll Now
              </Button>
            </div>

            <div className="mt-8 bg-card rounded-xl p-6 shadow-sm border">
              <h2 className="text-2xl font-semibold mb-6">What You'll Learn</h2>
              <div className="grid gap-4">
                {course.learningOutcomes?.map((outcome, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary" />
                    <p>{outcome}</p>
                  </div>
                )) || (
                  <p className="text-muted-foreground">No learning outcomes provided.</p>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-card rounded-xl p-6 shadow-sm border sticky top-6">
              <h3 className="font-semibold mb-4">Course Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Level</span>
                  <span>{course.level}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{course.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Students</span>
                  <span>{course.students}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <span>{course.category}</span>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold mb-4">Related Courses</h3>
                <div className="space-y-3">
                  {relatedCourses.map(relatedCourse => (
                    <Link 
                      key={relatedCourse.id} 
                      href={`/courses/${relatedCourse.id}`}
                      className="block p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <h4 className="font-medium">{relatedCourse.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedCourse.description}
                      </p>
                    </Link>
                  ))}
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
  return courses.map(course => ({
    courseId: course.id,
  }));
}

export async function generateMetadata({ params }: { params: { courseId: string } }) {
  const course = courses.find(c => c.id === params.courseId);
  
  if (!course) {
    return {
      title: 'Course Not Found',
      description: 'The requested course could not be found.',
    };
  }

  return {
    title: `${course.title} | EduGenius`,
    description: course.description,
    openGraph: {
      title: `${course.title} | EduGenius`,
      description: course.description,
      type: 'website',
    },
  };
}
