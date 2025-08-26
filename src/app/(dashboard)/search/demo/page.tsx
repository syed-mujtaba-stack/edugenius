'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Image, 
  Newspaper, 
  GraduationCap, 
  MessageCircleQuestion, 
  Camera, 
  Sparkles,
  ExternalLink,
  Play,
  Code2,
  Lightbulb
} from 'lucide-react';
import SearchService from '@/lib/searchService';
import { useToast } from '@/hooks/use-toast';

export default function SearchDemoPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [demoType, setDemoType] = useState<string>('');
  const { toast } = useToast();
  const searchService = SearchService.getInstance();

  const demos = [
    {
      id: 'general',
      title: 'General Web Search',
      description: 'AI-enhanced web search with smart categorization and relevance scoring',
      icon: Search,
      query: 'machine learning algorithms',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    },
    {
      id: 'images',
      title: 'Image Search',
      description: 'Find high-quality images with advanced filtering options',
      icon: Image,
      query: 'artificial intelligence diagrams',
      color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
    },
    {
      id: 'news',
      title: 'News Search',
      description: 'Latest news articles from reliable sources with date filtering',
      icon: Newspaper,
      query: 'artificial intelligence education',
      color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
    },
    {
      id: 'academic',
      title: 'Academic Research',
      description: 'Research papers and academic publications with citation data',
      icon: GraduationCap,
      query: 'neural networks deep learning',
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
    },
    {
      id: 'qa',
      title: 'AI Q&A',
      description: 'Get AI-powered answers with source citations and confidence scores',
      icon: MessageCircleQuestion,
      query: 'How do neural networks work in machine learning?',
      color: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
    },
    {
      id: 'visual',
      title: 'Visual Search',
      description: 'Search by image to find similar content and identify objects',
      icon: Camera,
      query: 'https://example.com/sample-diagram.jpg',
      color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
    }
  ];

  const runDemo = async (demo: typeof demos[0]) => {
    setIsRunning(true);
    setDemoType(demo.id);
    setResults([]);

    try {
      let searchResults;

      switch (demo.id) {
        case 'general':
          searchResults = await searchService.enhancedSearch(demo.query, {
            count: 5,
            includeAISummary: true,
            includeRelatedQuestions: true
          });
          setResults(searchResults.results);
          break;

        case 'images':
          searchResults = await searchService.searchImages(demo.query, {
            count: 12,
            filters: { safeSearch: 'active' }
          });
          setResults(searchResults.images);
          break;

        case 'news':
          searchResults = await searchService.searchNews(demo.query, {
            count: 8,
            category: 'technology',
            dateRange: 'week'
          });
          setResults(searchResults.news);
          break;

        case 'academic':
          searchResults = await searchService.searchAcademic(demo.query, {
            count: 6,
            subject: 'computer science',
            dateRange: 'year'
          });
          setResults(searchResults.papers);
          break;

        case 'qa':
          const qaResult = await searchService.answerQuestion(demo.query, {
            searchCount: 5,
            includeContext: true
          });
          setResults([qaResult]);
          break;

        case 'visual':
          // For demo purposes, we'll simulate visual search
          toast({
            title: "Visual Search Demo",
            description: "Visual search requires a valid image URL. This is a simulated demo.",
            variant: "default"
          });
          setResults([{
            title: "Visual Search Demo",
            description: "This would show similar images and object detection results."
          }]);
          break;
      }

      toast({
        title: "Demo Complete!",
        description: `Successfully demonstrated ${demo.title}`,
        variant: "default"
      });

    } catch (error) {
      console.error('Demo error:', error);
      toast({
        title: "Demo Error",
        description: error instanceof Error ? error.message : "Failed to run demo",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setDemoType('');
  };

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 sm:p-6 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl">Search Features Demo</h1>
          <p className="text-muted-foreground">
            Experience the power of AI-enhanced search across multiple modalities
          </p>
        </div>
      </div>

      {/* Demo Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {demos.map((demo) => (
          <Card key={demo.id} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${demo.color}`}>
                  <demo.icon className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-xs">
                  Demo
                </Badge>
              </div>
              <CardTitle className="text-lg">{demo.title}</CardTitle>
              <CardDescription className="text-sm">
                {demo.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Sample Query:</p>
                  <p className="text-sm font-mono">{demo.query}</p>
                </div>
                <Button 
                  onClick={() => runDemo(demo)}
                  disabled={isRunning}
                  className="w-full"
                  variant={demoType === demo.id ? "default" : "outline"}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isRunning && demoType === demo.id ? 'Running...' : 'Run Demo'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Demo Results - {demos.find(d => d.id === demoType)?.title}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={clearResults}>
                Clear Results
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={demoType} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="qa">Q&A</TabsTrigger>
                <TabsTrigger value="visual">Visual</TabsTrigger>
              </TabsList>

              {/* General Search Results */}
              <TabsContent value="general" className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{result.category}</Badge>
                      <Badge variant="outline">Score: {result.relevanceScore}%</Badge>
                    </div>
                    <h3 className="font-semibold">{result.title}</h3>
                    <p className="text-sm text-muted-foreground">{result.snippet}</p>
                    {result.aiSummary && (
                      <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded text-sm">
                        <strong>AI Summary:</strong> {result.aiSummary}
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>

              {/* Image Results */}
              <TabsContent value="images" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {results.map((image, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <img
                        src={image.image?.thumbnailLink || 'https://via.placeholder.com/200'}
                        alt={image.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-2">
                        <p className="text-xs font-medium truncate">{image.title}</p>
                        <p className="text-xs text-muted-foreground">{image.displayLink}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* News Results */}
              <TabsContent value="news" className="space-y-4">
                {results.map((news, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{news.source}</Badge>
                      {news.publishedDate && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(news.publishedDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold">{news.title}</h3>
                    <p className="text-sm text-muted-foreground">{news.snippet}</p>
                  </div>
                ))}
              </TabsContent>

              {/* Academic Results */}
              <TabsContent value="academic" className="space-y-4">
                {results.map((paper, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <h3 className="font-semibold">{paper.title}</h3>
                    {paper.authors && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Authors:</strong> {paper.authors.join(', ')}
                      </p>
                    )}
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      {paper.journal && <span><strong>Journal:</strong> {paper.journal}</span>}
                      {paper.citations && <span><strong>Citations:</strong> {paper.citations}</span>}
                    </div>
                    <p className="text-sm">{paper.abstract || paper.snippet}</p>
                  </div>
                ))}
              </TabsContent>

              {/* Q&A Results */}
              <TabsContent value="qa" className="space-y-4">
                {results.map((qa, index) => (
                  <div key={index} className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageCircleQuestion className="h-5 w-5 text-blue-600" />
                        <Badge variant="outline">
                          {Math.round(qa.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm leading-relaxed">{qa.answer}</p>
                    </div>
                    
                    {qa.sources && (
                      <div>
                        <h4 className="font-medium mb-2">Sources:</h4>
                        <div className="space-y-2">
                          {qa.sources.slice(0, 3).map((source: any, sourceIndex: number) => (
                            <div key={sourceIndex} className="p-2 border rounded text-sm">
                              <p className="font-medium">{source.title}</p>
                              <p className="text-muted-foreground text-xs">{source.snippet}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>

              {/* Visual Results */}
              <TabsContent value="visual" className="space-y-4">
                <div className="p-8 text-center border-2 border-dashed rounded-lg">
                  <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Visual Search Demo</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This would show results from image analysis including similar images, 
                    object detection, and text extraction.
                  </p>
                  <Button variant="outline" asChild>
                    <a href="/search" className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Try Visual Search
                    </a>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Search Features Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">Core Features</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• AI-enhanced web search with smart categorization</li>
                <li>• High-quality image search with filtering</li>
                <li>• Real-time news aggregation from reliable sources</li>
                <li>• Academic research paper discovery</li>
                <li>• AI-powered question answering with citations</li>
                <li>• Visual search and image analysis</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Advanced Capabilities</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Multi-modal search combining text, image, and voice</li>
                <li>• Relevance scoring and result ranking</li>
                <li>• Educational content prioritization</li>
                <li>• Date-based filtering and sorting</li>
                <li>• Safe search with content filtering</li>
                <li>• Real-time search suggestions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}