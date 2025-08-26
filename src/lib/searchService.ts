import { generateQAndA } from '@/ai/flows/generate-q-and-a';

export interface SearchResult {
  title: string;
  link: string;
  displayLink: string;
  snippet: string;
  htmlSnippet: string;
  formattedUrl: string;
  htmlFormattedUrl: string;
  pagemap?: {
    cse_thumbnail?: Array<{
      src: string;
      width: string;
      height: string;
    }>;
    metatags?: Array<{
      [key: string]: string;
    }>;
    cse_image?: Array<{
      src: string;
    }>;
  };
}

export interface ImageSearchResult {
  title: string;
  link: string;
  displayLink: string;
  snippet?: string;
  image: {
    contextLink: string;
    height: number;
    width: number;
    byteSize: number;
    thumbnailLink: string;
    thumbnailHeight: number;
    thumbnailWidth: number;
  };
}

export interface NewsSearchResult extends SearchResult {
  publishedDate?: string;
  source?: string;
  category?: 'breaking' | 'sports' | 'technology' | 'education' | 'general';
}

export interface AcademicSearchResult extends SearchResult {
  authors?: string[];
  publicationDate?: string;
  journal?: string;
  citations?: number;
  doi?: string;
  abstract?: string;
}

export interface SearchResponse {
  kind: string;
  url: {
    type: string;
    template: string;
  };
  queries: {
    request: Array<{
      title: string;
      totalResults: string;
      searchTerms: string;
      count: number;
      startIndex: number;
      inputEncoding: string;
      outputEncoding: string;
      safe: string;
      cx: string;
    }>;
    nextPage?: Array<{
      title: string;
      totalResults: string;
      searchTerms: string;
      count: number;
      startIndex: number;
      inputEncoding: string;
      outputEncoding: string;
      safe: string;
      cx: string;
    }>;
  };
  context: {
    title: string;
  };
  searchInformation: {
    searchTime: number;
    formattedSearchTime: string;
    totalResults: string;
    formattedTotalResults: string;
  };
  items: SearchResult[];
}

export interface EnhancedSearchResult extends SearchResult {
  relevanceScore: number;
  category: 'educational' | 'tutorial' | 'reference' | 'tool' | 'general';
  aiSummary?: string;
  relatedQuestions?: string[];
}

export interface SearchFilters {
  dateRange?: 'day' | 'week' | 'month' | 'year';
  fileType?: 'pdf' | 'doc' | 'ppt' | 'xls' | 'txt' | 'any';
  site?: string;
  language?: string;
  safeSearch?: 'active' | 'moderate' | 'off';
  sortBy?: 'relevance' | 'date';
  imageSize?: 'huge' | 'large' | 'medium' | 'small' | 'icon';
  imageType?: 'clipart' | 'face' | 'lineart' | 'stock' | 'photo' | 'animated';
  imageColorType?: 'color' | 'gray' | 'mono' | 'trans';
  rights?: 'publicdomain' | 'attribute' | 'sharealike' | 'noncommercial' | 'nonderived';
  exactTerms?: string;
  excludeTerms?: string;
  region?: string;
}

class SearchService {
  private static instance: SearchService;
  private apiKey: string;
  private searchEngineId: string;
  private baseUrl = 'https://www.googleapis.com/customsearch/v1';

  private constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_API_KEY || '';
    this.searchEngineId = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_ENGINE_ID || '';
  }

  public static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  /**
   * Perform a basic search using Google Custom Search API
   */
  public async search(
    query: string,
    options: {
      start?: number;
      count?: number;
      filters?: SearchFilters;
    } = {}
  ): Promise<SearchResponse> {
    const { start = 1, count = 10, filters = {} } = options;

    if (!this.apiKey || !this.searchEngineId) {
      throw new Error('Google Custom Search API key or Search Engine ID not configured');
    }

    const params = new URLSearchParams({
      key: this.apiKey,
      cx: this.searchEngineId,
      q: query,
      start: start.toString(),
      num: count.toString(),
    });

    // Apply filters
    if (filters.dateRange) {
      const dateRestrict = this.getDateRestrict(filters.dateRange);
      if (dateRestrict) params.append('dateRestrict', dateRestrict);
    }

    if (filters.fileType && filters.fileType !== 'any') {
      params.append('fileType', filters.fileType);
    }

    if (filters.site) {
      params.append('siteSearch', filters.site);
    }

    if (filters.language) {
      params.append('lr', `lang_${filters.language}`);
    }

    if (filters.safeSearch) {
      params.append('safe', filters.safeSearch);
    }

    if (filters.sortBy === 'date') {
      params.append('sort', 'date');
    }

    if (filters.exactTerms) {
      params.append('exactTerms', filters.exactTerms);
    }

    if (filters.excludeTerms) {
      params.append('excludeTerms', filters.excludeTerms);
    }

    if (filters.region) {
      params.append('gl', filters.region);
    }

    try {
      const response = await fetch(`${this.baseUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Search API error: ${response.status} ${response.statusText}`);
      }

      const data: SearchResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  /**
   * Enhanced search with AI-powered analysis and categorization
   */
  public async enhancedSearch(
    query: string,
    options: {
      start?: number;
      count?: number;
      filters?: SearchFilters;
      includeAISummary?: boolean;
      includeRelatedQuestions?: boolean;
    } = {}
  ): Promise<{
    results: EnhancedSearchResult[];
    searchInfo: SearchResponse['searchInformation'];
    aiInsights?: {
      queryAnalysis: string;
      suggestedFilters: SearchFilters;
      relatedTopics: string[];
    };
  }> {
    const { includeAISummary = true, includeRelatedQuestions = true } = options;

    // Perform the basic search
    const searchResponse = await this.search(query, options);

    // Enhance results with AI analysis
    const enhancedResults: EnhancedSearchResult[] = await Promise.all(
      (searchResponse.items || []).map(async (result) => {
        const enhanced: EnhancedSearchResult = {
          ...result,
          relevanceScore: this.calculateRelevanceScore(result, query),
          category: this.categorizeResult(result),
        };

        // Add AI summary if requested
        if (includeAISummary && result.snippet) {
          try {
            enhanced.aiSummary = await this.generateAISummary(result.snippet, query);
          } catch (error) {
            console.warn('Failed to generate AI summary:', error);
          }
        }

        // Add related questions if requested
        if (includeRelatedQuestions) {
          try {
            enhanced.relatedQuestions = await this.generateRelatedQuestions(result.title, query);
          } catch (error) {
            console.warn('Failed to generate related questions:', error);
          }
        }

        return enhanced;
      })
    );

    // Generate AI insights for the overall search
    let aiInsights;
    try {
      aiInsights = await this.generateSearchInsights(query, enhancedResults);
    } catch (error) {
      console.warn('Failed to generate AI insights:', error);
    }

    return {
      results: enhancedResults,
      searchInfo: searchResponse.searchInformation,
      aiInsights,
    };
  }

  /**
   * Search for educational content specifically
   */
  public async searchEducationalContent(
    subject: string,
    topic: string,
    options: {
      level?: 'beginner' | 'intermediate' | 'advanced';
      contentType?: 'article' | 'video' | 'tutorial' | 'exercise' | 'any';
      count?: number;
    } = {}
  ): Promise<EnhancedSearchResult[]> {
    const { level = 'intermediate', contentType = 'any', count = 10 } = options;

    let query = `${subject} ${topic}`;
    
    // Add level-specific terms
    switch (level) {
      case 'beginner':
        query += ' tutorial basics introduction guide';
        break;
      case 'intermediate':
        query += ' examples practice problems';
        break;
      case 'advanced':
        query += ' advanced concepts complex analysis';
        break;
    }

    // Add content type filters
    const filters: SearchFilters = {};
    switch (contentType) {
      case 'video':
        query += ' video lecture watch';
        filters.site = 'youtube.com';
        break;
      case 'tutorial':
        query += ' tutorial step-by-step how-to';
        break;
      case 'exercise':
        query += ' practice problems exercises worksheet';
        break;
      case 'article':
        filters.fileType = 'any';
        break;
    }

    const result = await this.enhancedSearch(query, {
      count,
      filters,
      includeAISummary: true,
      includeRelatedQuestions: true,
    });

    // Filter and sort by educational relevance
    return result.results
      .filter(r => r.category === 'educational' || r.category === 'tutorial')
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Search for career-related information
   */
  public async searchCareerInfo(
    field: string,
    options: {
      type?: 'jobs' | 'skills' | 'salary' | 'trends' | 'all';
      location?: string;
      count?: number;
    } = {}
  ): Promise<EnhancedSearchResult[]> {
    const { type = 'all', location = '', count = 10 } = options;

    let query = field;
    
    switch (type) {
      case 'jobs':
        query += ` jobs careers opportunities ${location}`;
        break;
      case 'skills':
        query += ' skills requirements qualifications needed';
        break;
      case 'salary':
        query += ` salary income earnings ${location}`;
        break;
      case 'trends':
        query += ' trends future outlook market demand';
        break;
      default:
        query += ` career jobs skills salary trends ${location}`;
    }

    const result = await this.enhancedSearch(query, {
      count,
      filters: {
        dateRange: 'year', // Recent information for career data
        safeSearch: 'active',
      },
      includeAISummary: true,
    });

    return result.results;
  }

  private getDateRestrict(range: string): string | null {
    switch (range) {
      case 'day': return 'd1';
      case 'week': return 'w1';
      case 'month': return 'm1';
      case 'year': return 'y1';
      default: return null;
    }
  }

  private calculateRelevanceScore(result: SearchResult, query: string): number {
    let score = 0;
    const queryLower = query.toLowerCase();
    const titleLower = result.title.toLowerCase();
    const snippetLower = result.snippet.toLowerCase();

    // Title relevance (high weight)
    if (titleLower.includes(queryLower)) score += 30;
    
    // Snippet relevance (medium weight)
    if (snippetLower.includes(queryLower)) score += 20;
    
    // Domain authority (basic scoring)
    const educationalDomains = ['edu', 'khan', 'coursera', 'edx', 'udemy', 'wikipedia'];
    if (educationalDomains.some(domain => result.displayLink.includes(domain))) {
      score += 15;
    }

    // Has thumbnail/image (slight preference)
    if (result.pagemap?.cse_thumbnail) score += 5;

    return Math.min(score, 100); // Cap at 100
  }

  private categorizeResult(result: SearchResult): EnhancedSearchResult['category'] {
    const url = result.link.toLowerCase();
    const title = result.title.toLowerCase();
    const snippet = result.snippet.toLowerCase();

    // Educational content indicators
    const educationalKeywords = ['tutorial', 'course', 'lesson', 'education', 'learn', 'study'];
    const educationalDomains = ['edu', 'khan', 'coursera', 'edx', 'udemy'];
    
    if (educationalDomains.some(domain => url.includes(domain)) ||
        educationalKeywords.some(keyword => title.includes(keyword) || snippet.includes(keyword))) {
      return 'educational';
    }

    // Tutorial content
    const tutorialKeywords = ['how to', 'tutorial', 'guide', 'step by step'];
    if (tutorialKeywords.some(keyword => title.includes(keyword) || snippet.includes(keyword))) {
      return 'tutorial';
    }

    // Reference content
    const referenceKeywords = ['reference', 'documentation', 'manual', 'api'];
    if (referenceKeywords.some(keyword => title.includes(keyword) || snippet.includes(keyword))) {
      return 'reference';
    }

    // Tool content
    const toolKeywords = ['tool', 'calculator', 'generator', 'converter'];
    if (toolKeywords.some(keyword => title.includes(keyword) || snippet.includes(keyword))) {
      return 'tool';
    }

    return 'general';
  }

  private async generateAISummary(snippet: string, query: string): Promise<string> {
    // This would integrate with your existing AI flows
    // For now, return a processed version of the snippet
    return snippet.length > 150 ? snippet.substring(0, 150) + '...' : snippet;
  }

  private async generateRelatedQuestions(title: string, originalQuery: string): Promise<string[]> {
    try {
      // Use your existing Q&A generation flow
      const result = await generateQAndA({
        topic: `Related questions for: ${title}. Original search: ${originalQuery}`,
        apiKey: process.env.GEMINI_API_KEY
      });
      
      // Parse the questions from the returned string
      const questionsText = result.questionsAndAnswers;
      const questions = questionsText.split('\n')
        .filter(line => line.trim().startsWith('Q:') || line.trim().match(/^\d+\./)) // Match "Q:" or numbered questions
        .map(line => line.replace(/^(Q:|\d+\.)/, '').trim())
        .filter(q => q.length > 0)
        .slice(0, 3);
      
      return questions;
    } catch (error) {
      console.warn('Failed to generate related questions:', error);
      return [];
    }
  }

  private async generateSearchInsights(
    query: string, 
    results: EnhancedSearchResult[]
  ): Promise<{
    queryAnalysis: string;
    suggestedFilters: SearchFilters;
    relatedTopics: string[];
  }> {
    // Analyze query intent
    let queryAnalysis = `Search for "${query}" returned ${results.length} results.`;
    
    const categories = results.reduce((acc, result) => {
      acc[result.category] = (acc[result.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantCategory = Object.entries(categories)
      .sort(([,a], [,b]) => b - a)[0]?.[0];

    if (dominantCategory) {
      queryAnalysis += ` Most results are ${dominantCategory} content.`;
    }

    // Suggest filters based on results
    const suggestedFilters: SearchFilters = {};
    
    if (dominantCategory === 'educational') {
      suggestedFilters.dateRange = 'year';
      suggestedFilters.safeSearch = 'active';
    }

    // Extract related topics from titles
    const relatedTopics = results
      .map(r => r.title.split(' '))
      .flat()
      .filter(word => word.length > 3)
      .slice(0, 10);

    return {
      queryAnalysis,
      suggestedFilters,
      relatedTopics: [...new Set(relatedTopics)],
    };
  }

  /**
   * Get search suggestions based on partial query
   */
  public async getSearchSuggestions(partialQuery: string): Promise<string[]> {
    if (partialQuery.length < 2) return [];

    try {
      // Use Google's suggest API (unofficial but commonly used)
      const response = await fetch(
        `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(partialQuery)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        return data[1] || [];
      }
    } catch (error) {
      console.warn('Failed to get search suggestions:', error);
    }

    return [];
  }

  /**
   * Search for images using Google Custom Search API
   */
  public async searchImages(
    query: string,
    options: {
      start?: number;
      count?: number;
      filters?: SearchFilters;
    } = {}
  ): Promise<{
    images: ImageSearchResult[];
    searchInfo: SearchResponse['searchInformation'];
  }> {
    const { start = 1, count = 10, filters = {} } = options;

    if (!this.apiKey || !this.searchEngineId) {
      throw new Error('Google Custom Search API key or Search Engine ID not configured');
    }

    const params = new URLSearchParams({
      key: this.apiKey,
      cx: this.searchEngineId,
      q: query,
      start: start.toString(),
      num: count.toString(),
      searchType: 'image',
    });

    // Apply image-specific filters
    if (filters.imageSize) {
      params.append('imgSize', filters.imageSize);
    }
    if (filters.imageType) {
      params.append('imgType', filters.imageType);
    }
    if (filters.imageColorType) {
      params.append('imgColorType', filters.imageColorType);
    }
    if (filters.rights) {
      params.append('rights', filters.rights);
    }
    if (filters.safeSearch) {
      params.append('safe', filters.safeSearch);
    }

    try {
      const response = await fetch(`${this.baseUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Image search API error: ${response.status} ${response.statusText}`);
      }

      const data: SearchResponse = await response.json();
      
      const images: ImageSearchResult[] = (data.items || []).map(item => ({
        title: item.title,
        link: item.link,
        displayLink: item.displayLink,
        snippet: item.snippet,
        image: {
          contextLink: item.formattedUrl,
          height: parseInt(item.pagemap?.cse_thumbnail?.[0]?.height || '0'),
          width: parseInt(item.pagemap?.cse_thumbnail?.[0]?.width || '0'),
          byteSize: 0, // Not provided by API
          thumbnailLink: item.pagemap?.cse_thumbnail?.[0]?.src || '',
          thumbnailHeight: parseInt(item.pagemap?.cse_thumbnail?.[0]?.height || '0'),
          thumbnailWidth: parseInt(item.pagemap?.cse_thumbnail?.[0]?.width || '0'),
        }
      }));

      return {
        images,
        searchInfo: data.searchInformation,
      };
    } catch (error) {
      console.error('Image search error:', error);
      throw error;
    }
  }

  /**
   * Search for recent news articles
   */
  public async searchNews(
    query: string,
    options: {
      start?: number;
      count?: number;
      category?: 'general' | 'education' | 'technology' | 'science';
      dateRange?: 'day' | 'week' | 'month';
    } = {}
  ): Promise<{
    news: NewsSearchResult[];
    searchInfo: SearchResponse['searchInformation'];
  }> {
    const { start = 1, count = 10, category = 'general', dateRange = 'week' } = options;

    let searchQuery = query;
    
    // Add category-specific terms
    switch (category) {
      case 'education':
        searchQuery += ' education learning school university';
        break;
      case 'technology':
        searchQuery += ' technology tech innovation software';
        break;
      case 'science':
        searchQuery += ' science research study discovery';
        break;
    }

    const filters: SearchFilters = {
      dateRange,
      site: 'news.google.com OR bbc.com OR cnn.com OR reuters.com OR dawn.com OR geo.tv',
      safeSearch: 'active',
      sortBy: 'date'
    };

    const result = await this.search(searchQuery, {
      start,
      count,
      filters
    });

    const news: NewsSearchResult[] = (result.items || []).map(item => ({
      ...item,
      category: category as NewsSearchResult['category'],
      publishedDate: this.extractPublishDate(item),
      source: this.extractSource(item.displayLink)
    }));

    return {
      news,
      searchInfo: result.searchInformation,
    };
  }

  /**
   * Search for academic papers and research content
   */
  public async searchAcademic(
    query: string,
    options: {
      start?: number;
      count?: number;
      subject?: 'computer science' | 'mathematics' | 'physics' | 'biology' | 'chemistry' | 'any';
      dateRange?: 'year' | 'month';
    } = {}
  ): Promise<{
    papers: AcademicSearchResult[];
    searchInfo: SearchResponse['searchInformation'];
  }> {
    const { start = 1, count = 10, subject = 'any', dateRange = 'year' } = options;

    let searchQuery = query;
    
    if (subject !== 'any') {
      searchQuery += ` ${subject}`;
    }
    
    searchQuery += ' research paper study analysis';

    const filters: SearchFilters = {
      dateRange,
      site: 'scholar.google.com OR arxiv.org OR researchgate.net OR ieee.org OR acm.org',
      fileType: 'pdf',
      safeSearch: 'active'
    };

    const result = await this.search(searchQuery, {
      start,
      count,
      filters
    });

    const papers: AcademicSearchResult[] = (result.items || []).map(item => ({
      ...item,
      authors: this.extractAuthors(item),
      publicationDate: this.extractPublishDate(item),
      journal: this.extractJournal(item),
      citations: this.extractCitations(item),
      doi: this.extractDOI(item),
      abstract: this.extractAbstract(item)
    }));

    return {
      papers,
      searchInfo: result.searchInformation,
    };
  }

  /**
   * AI-powered question answering based on search results
   */
  public async answerQuestion(
    question: string,
    options: {
      searchCount?: number;
      includeContext?: boolean;
    } = {}
  ): Promise<{
    answer: string;
    confidence: number;
    sources: EnhancedSearchResult[];
    relatedQuestions: string[];
  }> {
    const { searchCount = 5, includeContext = true } = options;

    // First, search for relevant information
    const searchResult = await this.enhancedSearch(question, {
      count: searchCount,
      includeAISummary: true,
      includeRelatedQuestions: true
    });

    // Combine search results into context
    const context = searchResult.results
      .map(r => `${r.title}: ${r.snippet}`)
      .join('\n\n');

    try {
      // Use your existing Q&A generation flow
      const qaResult = await generateQAndA({
        topic: `Context: ${context}\n\nQuestion: ${question}`,
        apiKey: process.env.GEMINI_API_KEY
      });

      // Parse the answer from the returned string
      const qaText = qaResult.questionsAndAnswers;
      // Extract the first answer or use the whole response
      const answerMatch = qaText.match(/A:\s*(.+?)(?=\n|$)/);
      const answer = answerMatch ? answerMatch[1].trim() : qaText.split('\n')[0] || 'I could not find a definitive answer to your question.';
      
      // Calculate confidence based on search result quality
      const avgRelevance = searchResult.results.reduce((sum, r) => sum + r.relevanceScore, 0) / searchResult.results.length;
      const confidence = Math.min(avgRelevance / 100, 0.95); // Cap at 95%

      // Gather related questions from all results
      const relatedQuestions = searchResult.results
        .flatMap(r => r.relatedQuestions || [])
        .filter((q, i, arr) => arr.indexOf(q) === i) // Remove duplicates
        .slice(0, 5);

      return {
        answer,
        confidence,
        sources: searchResult.results,
        relatedQuestions
      };
    } catch (error) {
      console.error('Failed to generate AI answer:', error);
      
      // Fallback to summarized search results
      const answer = searchResult.results.slice(0, 3)
        .map(r => r.aiSummary || r.snippet)
        .join(' ');

      return {
        answer: answer || 'I could not find relevant information to answer your question.',
        confidence: 0.3,
        sources: searchResult.results,
        relatedQuestions: []
      };
    }
  }

  /**
   * Visual search - find similar images or identify objects in images
   */
  public async visualSearch(
    imageUrl: string,
    options: {
      count?: number;
      includeText?: boolean;
    } = {}
  ): Promise<{
    results: EnhancedSearchResult[];
    imageInfo?: {
      objects: string[];
      text: string[];
      colors: string[];
    };
  }> {
    const { count = 10, includeText = true } = options;

    // Use reverse image search
    const query = `${imageUrl} similar images`;
    
    const searchResult = await this.enhancedSearch(query, {
      count,
      includeAISummary: true
    });

    // Extract image information (this would require additional AI services)
    let imageInfo;
    if (includeText) {
      try {
        // This would integrate with Google Vision API or similar
        imageInfo = {
          objects: ['detected objects would go here'],
          text: ['extracted text would go here'],
          colors: ['dominant colors would go here']
        };
      } catch (error) {
        console.warn('Failed to analyze image:', error);
      }
    }

    return {
      results: searchResult.results,
      imageInfo
    };
  }

  /**
   * Multi-modal search - combine text, image, and voice queries
   */
  public async multiModalSearch(
    query: {
      text?: string;
      imageUrl?: string;
      audioTranscript?: string;
    },
    options: {
      count?: number;
      mode?: 'comprehensive' | 'focused';
    } = {}
  ): Promise<{
    results: EnhancedSearchResult[];
    confidence: number;
    queryAnalysis: string;
  }> {
    const { count = 15, mode = 'comprehensive' } = options;
    
    let combinedQuery = '';
    let confidence = 1.0;

    // Combine different input modalities
    if (query.text) {
      combinedQuery += query.text;
    }

    if (query.audioTranscript) {
      combinedQuery += ' ' + query.audioTranscript;
      confidence *= 0.9; // Slightly lower confidence for voice
    }

    if (query.imageUrl) {
      // For image context, we'd analyze the image and add relevant terms
      combinedQuery += ' visual content image analysis';
      confidence *= 0.8; // Lower confidence for image interpretation
    }

    if (!combinedQuery.trim()) {
      throw new Error('At least one search modality must be provided');
    }

    const searchResult = await this.enhancedSearch(combinedQuery.trim(), {
      count,
      includeAISummary: true,
      includeRelatedQuestions: true
    });

    return {
      results: searchResult.results,
      confidence,
      queryAnalysis: `Multi-modal search combining ${Object.keys(query).join(', ')} inputs.`
    };
  }

  // Helper methods for metadata extraction
  private extractPublishDate(result: SearchResult): string | undefined {
    // Try to extract date from metatags
    const metatags = result.pagemap?.metatags?.[0];
    if (metatags) {
      return metatags['article:published_time'] || 
             metatags['datePublished'] || 
             metatags['pubdate'] || 
             metatags['date'];
    }
    return undefined;
  }

  private extractSource(displayLink: string): string {
    // Extract domain name as source
    try {
      const domain = new URL(`https://${displayLink}`).hostname;
      return domain.replace('www.', '').split('.')[0];
    } catch {
      return displayLink.split('.')[0];
    }
  }

  private extractAuthors(result: SearchResult): string[] {
    const metatags = result.pagemap?.metatags?.[0];
    if (metatags) {
      const author = metatags['author'] || metatags['citation_author'] || metatags['dc.creator'];
      if (author) {
        return author.split(/[,;]/).map(a => a.trim());
      }
    }
    return [];
  }

  private extractJournal(result: SearchResult): string | undefined {
    const metatags = result.pagemap?.metatags?.[0];
    if (metatags) {
      return metatags['citation_journal_title'] || 
             metatags['dc.source'] || 
             metatags['prism.publicationName'];
    }
    return undefined;
  }

  private extractCitations(result: SearchResult): number | undefined {
    const metatags = result.pagemap?.metatags?.[0];
    if (metatags?.['citation_count']) {
      return parseInt(metatags['citation_count']);
    }
    return undefined;
  }

  private extractDOI(result: SearchResult): string | undefined {
    const metatags = result.pagemap?.metatags?.[0];
    if (metatags) {
      return metatags['citation_doi'] || metatags['dc.identifier'];
    }
    return undefined;
  }

  private extractAbstract(result: SearchResult): string | undefined {
    const metatags = result.pagemap?.metatags?.[0];
    if (metatags) {
      return metatags['description'] || 
             metatags['citation_abstract'] || 
             metatags['dc.description'];
    }
    return result.snippet;
  }
}

export default SearchService;