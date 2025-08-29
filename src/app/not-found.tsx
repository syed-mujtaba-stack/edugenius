'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Search, 
  BookOpen, 
  Users, 
  TrendingUp, 
  ArrowLeft, 
  ExternalLink,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Star,
  Clock,
  Lightbulb
} from 'lucide-react';
import { useTrackEvent } from '@/hooks/useGoogleAnalytics';
import { toast } from '@/hooks/use-toast';

interface QuickLink {
  title: string;
  description: string;
  href: string;
  icon: any;
  category: string;
  popular?: boolean;
}

interface SearchSuggestion {
  term: string;
  category: string;
  href: string;
}

export default function NotFoundPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [timeOnPage, setTimeOnPage] = useState(0);
  
  const router = useRouter();
  const { trackError, trackSearch, trackFeatureUsed } = useTrackEvent();

  useEffect(() => {
    // Track 404 error with current path
    const path = window.location.pathname;
    setCurrentPath(path);
    
    trackError('404_page_not_found', `Page not found: ${path}`, path);
    
    // Track time on 404 page
    const startTime = Date.now();
    const interval = setInterval(() => {
      setTimeOnPage(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [trackError]);

  const quickLinks: QuickLink[] = [
    {
      title: 'Dashboard',
      description: 'Access your personalized learning dashboard',
      href: '/',
      icon: Home,
      category: 'Navigation',
      popular: true
    },
    {
      title: 'AI Tools',
      description: 'Explore our AI-powered learning tools',
      href: '/ai-tools',
      icon: Lightbulb,
      category: 'AI Features',
      popular: true
    },
    {
      title: 'Search',
      description: 'Find educational content and resources',
      href: '/search',
      icon: Search,
      category: 'Discovery'
    },
    {
      title: 'Study Plans',
      description: 'Create personalized study schedules',
      href: '/study-plans',
      icon: BookOpen,
      category: 'Learning'
    },
    {
      title: 'Performance Analytics',
      description: 'Monitor website performance metrics',
      href: '/performance',
      icon: TrendingUp,
      category: 'Analytics'
    },
    {
      title: 'Video Calling',
      description: 'Join online classes and study groups',
      href: '/video-call',
      icon: Users,
      category: 'Collaboration'
    }
  ];

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: 'Search Required',
        description: 'Please enter a search term to continue.',
        variant: 'destructive',
      });
      return;
    }

    setIsSearching(true);
    
    // Track search from 404 page
    trackSearch(searchTerm, '404_page_search');
    
    // Simulate search and redirect
    setTimeout(() => {
      setIsSearching(false);
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }, 1000);
  };

  const handleQuickLinkClick = (link: QuickLink) => {
    trackFeatureUsed(`404_quick_link_${link.title.toLowerCase().replace(' ', '_')}`, '404 Navigation');
    router.push(link.href);
  };

  const handleGoBack = () => {
    trackFeatureUsed('404_go_back', '404 Navigation');
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const generateSearchSuggestions = (query: string) => {
    const suggestions: SearchSuggestion[] = [
      { term: 'AI essay evaluator', category: 'AI Tools', href: '/ai-tools/essay-evaluator' },
      { term: 'test generator', category: 'AI Tools', href: '/ai-tools/test-generator' },
      { term: 'study plans', category: 'Learning', href: '/study-plans' },
      { term: 'career counseling', category: 'AI Tools', href: '/ai-tools/career-counseling' },
      { term: 'performance monitoring', category: 'Analytics', href: '/performance' },
      { term: 'video classes', category: 'Collaboration', href: '/video-call' }
    ];

    return suggestions.filter(suggestion => 
      suggestion.term.toLowerCase().includes(query.toLowerCase()) ||
      suggestion.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  };

  useEffect(() => {
    if (searchTerm.length > 2) {
      setSearchSuggestions(generateSearchSuggestions(searchTerm));
    } else {
      setSearchSuggestions([]);
    }
  }, [searchTerm]);

  const popularLinks = quickLinks.filter(link => link.popular);
  const otherLinks = quickLinks.filter(link => !link.popular);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Main 404 Section */}
        <div className="text-center space-y-6">
          <div className="relative">
            <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertCircle className="h-24 w-24 text-primary animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The page you're looking for doesn't exist or may have been moved. 
              But don't worry, we have plenty of educational resources to help you continue learning!
            </p>
          </div>

          {/* Current Path Info */}
          {currentPath && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 max-w-2xl mx-auto">
              <p className="text-sm text-red-700 dark:text-red-300">
                <strong>Requested URL:</strong> <code className="bg-red-100 dark:bg-red-800/50 px-2 py-1 rounded text-xs">{currentPath}</code>
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Search Section */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search for Content
            </CardTitle>
            <CardDescription>
              Can't find what you're looking for? Try searching our educational resources.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search for courses, tools, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
              <Button 
                onClick={handleSearch}
                disabled={isSearching || !searchTerm.trim()}
                className="px-6"
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </Button>
            </div>

            {/* Search Suggestions */}
            {searchSuggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Suggestions:</p>
                <div className="grid grid-cols-1 gap-2">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchTerm(suggestion.term);
                        trackFeatureUsed('404_search_suggestion', '404 Search');
                      }}
                      className="flex items-center justify-between p-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{suggestion.term}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.category}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Navigation Links */}
        <div className="space-y-6">
          {/* Popular Links */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Popular Destinations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularLinks.map((link, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  onClick={() => handleQuickLinkClick(link)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <link.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                          {link.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {link.description}
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {link.category}
                        </Badge>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Other Links */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Other Helpful Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {otherLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickLinkClick(link)}
                  className="flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                >
                  <link.icon className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {link.title}
                    </span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {link.category}
                    </Badge>
                  </div>
                  <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleGoBack}
            variant="outline" 
            size="lg"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Link href="/">
            <Button size="lg" className="flex items-center gap-2 w-full sm:w-auto">
              <Home className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="text-center space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-900 dark:text-blue-100">Did you know?</span>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              EduGenius offers AI-powered learning tools, personalized study plans, and real-time collaboration features. 
              Explore our platform to enhance your learning experience!
            </p>
          </div>

          {/* Time on page indicator */}
          {timeOnPage > 0 && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              You've been on this page for {timeOnPage} second{timeOnPage !== 1 ? 's' : ''}
            </div>
          )}

          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you continue to experience issues, please{' '}
            <Link href="/contact" className="text-primary hover:underline">
              contact our support team
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}