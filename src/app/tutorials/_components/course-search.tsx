'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

type Category = {
  name: string;
  value: string;
};

interface CourseSearchProps {
  categories: Category[];
  onSearchChangeAction: (query: string, category: string) => void;
}

export function CourseSearch({ categories, onSearchChangeAction }: CourseSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChangeAction(query, selectedCategory);
  };

  // Handle category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onSearchChangeAction(searchQuery, category);
  };

  // Clear search and reset filters
  const handleClearSearch = () => {
    setSearchQuery('');
    onSearchChangeAction('', selectedCategory);
  };

  return (
    <>
      {/* Search Bar */}
      <div className="w-full max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-6 text-base rounded-xl border-border/50 focus-visible:ring-2 focus-visible:ring-primary/50"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12 px-4">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? 'default' : 'outline'}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              selectedCategory === category.value 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'hover:bg-primary/10 hover:text-primary'
            }`}
            onClick={() => handleCategoryChange(category.value)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </>
  );
}
