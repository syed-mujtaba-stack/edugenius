'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Briefcase, 
  Globe, 
  Calendar, 
  FileText, 
  Video, 
  ExternalLink,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
  Brain,
  Image,
  Newspaper,
  GraduationCap,
  MessageCircleQuestion,
  Camera,
  Mic,
  Download,
  Copy
} from 'lucide-react';
import SearchService, { EnhancedSearchResult, SearchFilters, ImageSearchResult, NewsSearchResult, AcademicSearchResult } from '@/lib/searchService';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/use-debounce';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [results, setResults] = useState<EnhancedSearchResult[]>([]);
  const [imageResults, setImageResults] = useState<ImageSearchResult[]>([]);
  const [newsResults, setNewsResults] = useState<NewsSearchResult[]>([]);
  const [academicResults, setAcademicResults] = useState<AcademicSearchResult[]>([]);
  const [qaAnswer, setQaAnswer] = useState<{
    answer: string;
    confidence: number;
    sources: EnhancedSearchResult[];
    relatedQuestions: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<'general' | 'images' | 'news' | 'academic' | 'qa' | 'visual'>('general');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTime, setSearchTime] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [visualSearchImage, setVisualSearchImage] = useState<string>('');
  
  const { toast } = useToast();
  const searchService = SearchService.getInstance();
  const debouncedQuery = useDebounce(query, 300);

  // Get search suggestions
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      getSuggestions(debouncedQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  const getSuggestions = async (searchQuery: string) => {
    try {
      const suggestions = await searchService.getSearchSuggestions(searchQuery);
      setSuggestions(suggestions.slice(0, 5));
    } catch (error) {
      console.warn('Failed to get suggestions:', error);
    }
  };

  const handleSearch = useCallback(async (searchQuery: string = query, page: number = 1) => {
    if (!searchQuery.trim() && searchMode !== 'visual') return;

    setIsLoading(true);
    try {
      const start = (page - 1) * 10 + 1;
      let searchResults;

      // Clear previous results
      setResults([]);
      setImageResults([]);
      setNewsResults([]);
      setAcademicResults([]);
      setQaAnswer(null);

      switch (searchMode) {
        case 'images':
          searchResults = await searchService.searchImages(searchQuery, {
            start,
            count: 20,
            filters
          });
          setImageResults(searchResults.images);
          setTotalResults(parseInt(searchResults.searchInfo.totalResults) || searchResults.images.length);
          setSearchTime(searchResults.searchInfo.searchTime || 0);
          break;

        case 'news':
          searchResults = await searchService.searchNews(searchQuery, {
            start,
            count: 15,
            category: 'general',
            dateRange: filters.dateRange && ['day', 'week', 'month'].includes(filters.dateRange) 
              ? filters.dateRange as 'day' | 'week' | 'month'
              : 'week'
          });
          setNewsResults(searchResults.news);
          setTotalResults(parseInt(searchResults.searchInfo.totalResults) || searchResults.news.length);
          setSearchTime(searchResults.searchInfo.searchTime || 0);
          break;

        case 'academic':
          searchResults = await searchService.searchAcademic(searchQuery, {
            start,
            count: 10,
            subject: 'any',
            dateRange: filters.dateRange && ['year', 'month'].includes(filters.dateRange)
              ? filters.dateRange as 'year' | 'month'
              : 'year'
          });
          setAcademicResults(searchResults.papers);
          setTotalResults(parseInt(searchResults.searchInfo.totalResults) || searchResults.papers.length);
          setSearchTime(searchResults.searchInfo.searchTime || 0);
          break;

        case 'qa':
          const qaResult = await searchService.answerQuestion(searchQuery, {
            searchCount: 8,
            includeContext: true
          });
          setQaAnswer(qaResult);
          setTotalResults(qaResult.sources.length);
          setSearchTime(0.5); // Estimated time for AI processing
          break;

        case 'visual':
          if (visualSearchImage) {
            const visualResult = await searchService.visualSearch(visualSearchImage, {
              count: 15,
              includeText: true
            });
            setResults(visualResult.results);
            setTotalResults(visualResult.results.length);
            setSearchTime(0.8);
          } else {
            throw new Error('Please provide an image URL for visual search');
          }
          break;
          
        default:
          searchResults = await searchService.enhancedSearch(searchQuery, {
            start,
            count: 10,
            filters,
            includeAISummary: true,
            includeRelatedQuestions: true
          });
          setResults(searchResults.results);
          setTotalResults(parseInt(searchResults.searchInfo.totalResults) || searchResults.results.length);
          setSearchTime(searchResults.searchInfo.searchTime || 0);
      }

      setCurrentPage(page);
      
      if (searchMode === 'images' && imageResults.length === 0) {
        toast({ title: "No images found", description: "Try different search terms", variant: "default" });
      } else if (searchMode === 'news' && newsResults.length === 0) {
        toast({ title: "No news found", description: "Try different search terms or time range", variant: "default" });
      } else if (searchMode === 'academic' && academicResults.length === 0) {
        toast({ title: "No academic papers found", description: "Try broader search terms", variant: "default" });
      } else if ((searchMode === 'general' || searchMode === 'visual') && results.length === 0) {
        toast({ title: "No results found", description: "Try adjusting your search terms or filters", variant: "default" });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: error instanceof Error ? error.message : "Failed to perform search",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setSuggestions([]);
    }
  }, [query, searchMode, filters, visualSearchImage, toast, searchService, imageResults.length, newsResults.length, academicResults.length, results.length]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'educational': return <BookOpen className="h-4 w-4" />;
      case 'tutorial': return <Video className="h-4 w-4" />;
      case 'tool': return <Brain className="h-4 w-4" />;
      case 'reference': return <FileText className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'educational': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'tutorial': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'tool': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'reference': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getSearchPlaceholder = () => {
    switch (searchMode) {
      case 'images': return 'Search for images, photos, diagrams...';
      case 'news': return 'Search for latest news and articles...';
      case 'academic': return 'Search for research papers, studies...';
      case 'qa': return 'Ask a question and get AI-powered answers...';
      case 'visual': return 'Enter image URL for visual search...';
      default: return 'Search anything...';
    }
  };

  const getSearchDescription = () => {
    switch (searchMode) {
      case 'images': return 'Find high-quality images with advanced filtering options';
      case 'news': return 'Get the latest news articles from reliable sources';
      case 'academic': return 'Access research papers and academic publications';
      case 'qa': return 'Get AI-powered answers with source citations';
      case 'visual': return 'Search by image to find similar content';
      default: return 'AI-enhanced web search with smart categorization';
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-6 md:p-8">
      <div className="flex items-center gap-3">
        <Search className="h-8 w-8 text-primary" />
        <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl">AI-Powered Search</h1>
      </div>

      {/* Search Input and Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Smart Search
          </CardTitle>
          <CardDescription>
            Search the web with AI-enhanced results and educational focus
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Mode Tabs */}
          <Tabs value={searchMode} onValueChange={(value) => setSearchMode(value as any)}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="general" className="flex items-center gap-1 text-xs">
                <Globe className="h-3 w-3" />
                General
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-1 text-xs">
                <Image className="h-3 w-3" />
                Images
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center gap-1 text-xs">
                <Newspaper className="h-3 w-3" />
                News
              </TabsTrigger>
              <TabsTrigger value="academic" className="flex items-center gap-1 text-xs">
                <GraduationCap className="h-3 w-3" />
                Academic
              </TabsTrigger>
              <TabsTrigger value="qa" className="flex items-center gap-1 text-xs">
                <MessageCircleQuestion className="h-3 w-3" />
                Q&A
              </TabsTrigger>
              <TabsTrigger value="visual" className="flex items-center gap-1 text-xs">
                <Camera className="h-3 w-3" />
                Visual
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search Input */}
          <div className="relative">
            {searchMode === 'visual' ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter image URL for visual search..."
                    value={visualSearchImage}
                    onChange={(e) => setVisualSearchImage(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={() => handleSearch()} disabled={isLoading || !visualSearchImage}>
                    {isLoading ? 'Searching...' : 'Search'}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Paste an image URL to find similar images and identify objects in the image.
                </p>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder={getSearchPlaceholder()}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  
                  {/* Search Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-background border rounded-md shadow-lg">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 hover:bg-accent cursor-pointer text-sm"
                          onClick={() => {
                            setQuery(suggestion);
                            setSuggestions([]);
                            handleSearch(suggestion);
                          }}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button onClick={() => handleSearch()} disabled={isLoading || (!query.trim() && (searchMode as any) !== 'visual')}>
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-muted-foreground">
                {getSearchDescription()}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-muted rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="dateRange">Date Range</Label>
                <Select
                  value={filters.dateRange || 'all'}
                  onValueChange={(value) => handleFilterChange('dateRange', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any time</SelectItem>
                    <SelectItem value="day">Past 24 hours</SelectItem>
                    <SelectItem value="week">Past week</SelectItem>
                    <SelectItem value="month">Past month</SelectItem>
                    <SelectItem value="year">Past year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileType">File Type</Label>
                <Select
                  value={filters.fileType || 'any'}
                  onValueChange={(value) => handleFilterChange('fileType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="doc">Word Doc</SelectItem>
                    <SelectItem value="ppt">PowerPoint</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="safeSearch">Safe Search</Label>
                <Select
                  value={filters.safeSearch || 'moderate'}
                  onValueChange={(value) => handleFilterChange('safeSearch', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Strict</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="off">Off</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site">Site</Label>
                <Input
                  placeholder="e.g., wikipedia.org"
                  value={filters.site || ''}
                  onChange={(e) => handleFilterChange('site', e.target.value)}
                />
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {(results.length > 0 || imageResults.length > 0 || newsResults.length > 0 || academicResults.length > 0 || qaAnswer || isLoading) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {searchMode === 'images' ? 'Image Results' : 
                 searchMode === 'news' ? 'News Results' :
                 searchMode === 'academic' ? 'Academic Papers' :
                 searchMode === 'qa' ? 'AI Answer' : 'Search Results'}
              </CardTitle>
              {!isLoading && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {searchTime.toFixed(2)}s
                  </span>
                  <span>{totalResults.toLocaleString()} results</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-3 bg-muted animate-pulse rounded w-full" />
                    <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {/* Q&A Results */}
                {searchMode === 'qa' && qaAnswer && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-6 rounded-lg border">
                      <div className="flex items-center gap-2 mb-4">
                        <Brain className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-lg">AI Answer</h3>
                        <Badge variant="outline" className="ml-auto">
                          {Math.round(qaAnswer.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm leading-relaxed mb-4">{qaAnswer.answer}</p>
                      
                      {qaAnswer.relatedQuestions.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Related Questions:</p>
                          <div className="flex flex-wrap gap-2">
                            {qaAnswer.relatedQuestions.map((question, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="cursor-pointer hover:bg-accent"
                                onClick={() => {
                                  setQuery(question);
                                  handleSearch(question);
                                }}
                              >
                                {question}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Sources:</h4>
                      <div className="space-y-3">
                        {qaAnswer.sources.slice(0, 5).map((source, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 border rounded">
                            <div className="flex-1">
                              <h5 className="font-medium text-sm">
                                <a href={source.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                                  {source.title}
                                </a>
                              </h5>
                              <p className="text-xs text-muted-foreground mb-1">{source.displayLink}</p>
                              <p className="text-xs">{source.snippet}</p>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {source.relevanceScore}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Image Results */}
                {searchMode === 'images' && imageResults.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {imageResults.map((image, index) => (
                      <div key={index} className="group relative overflow-hidden rounded-lg border bg-card">
                        <img
                          src={image.image.thumbnailLink}
                          alt={image.title}
                          className="w-full h-40 object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-end">
                          <div className="p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-sm font-medium line-clamp-2 mb-1">{image.title}</p>
                            <p className="text-xs text-gray-300">{image.displayLink}</p>
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="secondary" className="h-6 text-xs" asChild>
                                <a href={image.link} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  View
                                </a>
                              </Button>
                              <Button 
                                size="sm" 
                                variant="secondary" 
                                className="h-6 text-xs"
                                onClick={() => {
                                  navigator.clipboard.writeText(image.link);
                                  toast({ title: "Copied!", description: "Image URL copied to clipboard" });
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* News Results */}
                {searchMode === 'news' && newsResults.length > 0 && (
                  <div className="space-y-4">
                    {newsResults.map((news, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        {news.pagemap?.cse_thumbnail?.[0] && (
                          <img
                            src={news.pagemap.cse_thumbnail[0].src}
                            alt=""
                            className="w-20 h-20 object-cover rounded border flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {news.source}
                            </Badge>
                            {news.publishedDate && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(news.publishedDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold hover:text-primary">
                            <a href={news.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {news.title}
                            </a>
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {news.snippet}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">{news.displayLink}</p>
                            <Button size="sm" variant="outline" asChild>
                              <a href={news.link} target="_blank" rel="noopener noreferrer">
                                Read More
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Academic Results */}
                {searchMode === 'academic' && academicResults.length > 0 && (
                  <div className="space-y-6">
                    {academicResults.map((paper, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">
                              <a href={paper.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
                                {paper.title}
                              </a>
                            </h3>
                            
                            {paper.authors && paper.authors.length > 0 && (
                              <p className="text-sm text-muted-foreground mb-1">
                                <strong>Authors:</strong> {paper.authors.join(', ')}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                              {paper.journal && <span><strong>Journal:</strong> {paper.journal}</span>}
                              {paper.publicationDate && <span><strong>Published:</strong> {new Date(paper.publicationDate).getFullYear()}</span>}
                              {paper.citations && <span><strong>Citations:</strong> {paper.citations}</span>}
                            </div>
                            
                            <p className="text-sm leading-relaxed">
                              {paper.abstract || paper.snippet}
                            </p>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-4">
                            {paper.doi && (
                              <Badge variant="outline" className="text-xs">
                                DOI: {paper.doi.substring(0, 20)}...
                              </Badge>
                            )}
                            <Button size="sm" variant="outline" asChild>
                              <a href={paper.link} target="_blank" rel="noopener noreferrer">
                                <Download className="h-3 w-3 mr-1" />
                                View Paper
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* General Results */}
                {(searchMode === 'general' || searchMode === 'visual') && results.length > 0 && (
                  <ScrollArea className="h-96">
                    <div className="space-y-6">
                      {results.map((result, index) => (
                        <div key={index} className="space-y-3 pb-4 border-b last:border-b-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="secondary" 
                                  className={`${getCategoryColor(result.category)} flex items-center gap-1`}
                                >
                                  {getCategoryIcon(result.category)}
                                  {result.category}
                                </Badge>
                                {result.relevanceScore > 80 && (
                                  <Badge variant="default" className="flex items-center gap-1">
                                    <Star className="h-3 w-3" />
                                    High Match
                                  </Badge>
                                )}
                              </div>
                              
                              <div>
                                <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">
                                  <a 
                                    href={result.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 hover:underline"
                                  >
                                    {result.title}
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </h3>
                                <p className="text-sm text-muted-foreground">{result.displayLink}</p>
                              </div>
                              
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {result.aiSummary || result.snippet}
                              </p>
                              
                              {result.relatedQuestions && result.relatedQuestions.length > 0 && (
                                <div className="space-y-1">
                                  <p className="text-xs font-medium text-muted-foreground">Related Questions:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {result.relatedQuestions.slice(0, 2).map((question, qIndex) => (
                                      <Badge 
                                        key={qIndex} 
                                        variant="outline" 
                                        className="text-xs cursor-pointer hover:bg-accent"
                                        onClick={() => {
                                          setQuery(question);
                                          handleSearch(question);
                                        }}
                                      >
                                        {question}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {result.pagemap?.cse_thumbnail?.[0] && (
                              <img
                                src={result.pagemap.cse_thumbnail[0].src}
                                alt=""
                                className="w-20 h-20 object-cover rounded border"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {((searchMode === 'general' && results.length > 0) || 
        (searchMode === 'images' && imageResults.length > 0) || 
        (searchMode === 'news' && newsResults.length > 0) || 
        (searchMode === 'academic' && academicResults.length > 0) || 
        (searchMode === 'visual' && results.length > 0)) && !isLoading && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => handleSearch(query, currentPage - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Page {currentPage}
          </span>
          <Button
            variant="outline"
            disabled={
              (searchMode === 'general' && results.length < 10) ||
              (searchMode === 'images' && imageResults.length < 20) ||
              (searchMode === 'news' && newsResults.length < 15) ||
              (searchMode === 'academic' && academicResults.length < 10) ||
              (searchMode === 'visual' && results.length < 10) ||
              (searchMode as any) === 'qa' // Q&A doesn't support pagination
            }
            onClick={() => handleSearch(query, currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </main>
  );
}