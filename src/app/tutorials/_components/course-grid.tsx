'use client';

import Link from 'next/link';
import { Search, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface CourseGridProps {
  courses: Course[];
  searchQuery: string;
  selectedCategory: string;
  onClearFiltersAction: () => void;
}

export function CourseGrid({ 
  courses, 
  searchQuery, 
  selectedCategory, 
  onClearFiltersAction 
}: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium text-foreground mb-2">No courses found</h3>
        <p className="text-muted-foreground">
          {searchQuery 
            ? `No courses match "${searchQuery}"`
            : `No courses available in this category`
          }
        </p>
        {(searchQuery || selectedCategory !== 'all') && (
          <Button 
            variant="ghost" 
            className="mt-4"
            onClick={onClearFiltersAction}
          >
            Clear filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <Link href={`/tutorials/${course.id}`} key={course.id}>
          <div className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
            <div className="relative h-48 bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                {course.icon}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {course.category}
                </span>
                <span className="text-xs text-muted-foreground">{course.level}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <p className="text-muted-foreground mb-4 flex-1">{course.description}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.students} students</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
