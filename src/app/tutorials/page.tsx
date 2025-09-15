'use client';

import { CourseSearch } from './_components/course-search';
import { CourseGrid } from './_components/course-grid';
import { courses, type Course } from '@/lib/courses';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';

// Define the categories based on available courses
const categories = [
  { name: 'All', value: 'all' },
  ...Array.from(new Set(courses.map(course => course.category))).map(category => ({
    name: category,
    value: category
  }))
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
