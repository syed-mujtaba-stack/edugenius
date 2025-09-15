'use client';

import { useState, useMemo } from 'react';
import { Search, BookOpen, Lightbulb, Settings, HelpCircle } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { documentationGuides } from '@/data/documentation-guides';
import type { DocumentationCategory } from '@/types/docs';

const DOCUMENTATION_CATEGORIES: DocumentationCategory[] = [
  'getting-started',
  'ai-features',
  'account',
  'troubleshooting'
];

const CATEGORY_ICONS: Record<DocumentationCategory, JSX.Element> = {
  'getting-started': <BookOpen className="h-4 w-4 mr-2" />,
  'ai-features': <Lightbulb className="h-4 w-4 mr-2" />,
  'account': <Settings className="h-4 w-4 mr-2" />,
  'troubleshooting': <HelpCircle className="h-4 w-4 mr-2" />,
} as const;

const CATEGORY_LABELS: Record<DocumentationCategory, string> = {
  'getting-started': 'Getting Started',
  'ai-features': 'AI Features',
  'account': 'Account',
  'troubleshooting': 'Troubleshooting',
} as const;

type CategoryCounts = {
  all: number;
} & Record<DocumentationCategory, number>;

export function DocumentationClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredGuides = useMemo(() => {
    return documentationGuides.filter(guide => {
      const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          guide.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          guide.keywords.some(keyword => 
                            keyword.toLowerCase().includes(searchQuery.toLowerCase())
                          );
      
      const matchesCategory = activeCategory === 'all' || guide.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const categories = useMemo<CategoryCounts>(() => {
    const counts = {
      all: documentationGuides.length,
      'getting-started': 0,
      'ai-features': 0,
      'account': 0,
      'troubleshooting': 0
    };
    
    documentationGuides.forEach(guide => {
      counts[guide.category]++;
    });
    
    return counts;
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="flex flex-col items-center space-y-4 text-center mb-8">
          <h1 className="text-4xl font-headline md:text-5xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-lg">
            Find everything you need to know about using EduGenius. Search our documentation or browse by category.
          </p>
          
          <div className="w-full max-w-2xl mt-4 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documentation..."
                className="w-full pl-10 pr-4 py-6 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {searchQuery && (
              <p className="text-sm text-muted-foreground mt-2 text-left">
                {filteredGuides.length} {filteredGuides.length === 1 ? 'result' : 'results'} found
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <div className="space-y-2">
                <Button
                  variant={activeCategory === 'all' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveCategory('all')}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  All Guides
                  <Badge variant="outline" className="ml-auto">
                    {categories.all}
                  </Badge>
                </Button>
                
                {DOCUMENTATION_CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveCategory(category)}
                  >
                    {CATEGORY_ICONS[category]}
                    {CATEGORY_LABELS[category]}
                    <Badge variant="outline" className="ml-auto">
                      {categories[category]}
                    </Badge>
                  </Button>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium mb-2">Popular Topics</h3>
                {['API Integration', 'Billing', 'Mobile App', 'Data Privacy'].map((topic) => (
                  <Button
                    key={topic}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-muted-foreground"
                    onClick={() => setSearchQuery(topic.toLowerCase())}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {filteredGuides.length > 0 ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Documentation</CardTitle>
                      <CardDescription>
                        {activeCategory === 'all' 
                          ? 'All documentation articles' 
                          : `Articles in ${activeCategory in CATEGORY_LABELS ? CATEGORY_LABELS[activeCategory as DocumentationCategory] : activeCategory}`}
                      </CardDescription>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {filteredGuides.length} {filteredGuides.length === 1 ? 'article' : 'articles'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="w-full">
                    {filteredGuides.map((guide) => (
                      <AccordionItem value={guide.id} key={guide.id} className="border-b">
                        <AccordionTrigger className="py-4 hover:no-underline">
                          <div className="text-left">
                            <div className="flex items-center">
                              <h3 className="font-medium">{guide.title}</h3>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {CATEGORY_LABELS[guide.category]}
                              </Badge>
                            </div>
                            {guide.keywords.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {guide.keywords.slice(0, 3).map((keyword) => (
                                  <span key={keyword} className="text-xs text-muted-foreground">#{keyword}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 px-1">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p>{guide.content}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Last updated: {new Date(guide.lastUpdated).toLocaleDateString()}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  
                  {filteredGuides.length === 0 && searchQuery && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setSearchQuery('');
                          setActiveCategory('all');
                        }}
                      >
                        Clear search
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No documentation found matching your criteria.</p>
              </div>
            )}
            
            <div className="mt-8 p-6 bg-muted/20 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Need more help?</h3>
              <p className="text-muted-foreground mb-4">
                Can&apos;t find what you&apos;re looking for? Our support team is here to help.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline">Contact Support</Button>
                <Button>Submit Feedback</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground border-t mt-12">
        <p>© {new Date().getFullYear()} EduGenius. All rights reserved.</p>
        <p className="mt-1 text-xs">Documentation last updated: {new Date().toLocaleDateString()}</p>
      </footer>
    </div>
  );
}
