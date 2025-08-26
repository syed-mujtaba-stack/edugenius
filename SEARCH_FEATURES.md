# Advanced Search System Documentation

## Overview

EduGenius now features a comprehensive AI-powered search system that provides multiple search modalities with enhanced capabilities. The search system leverages Google Custom Search Engine API combined with AI enhancement for superior results.

## Features

### 🔍 General Web Search
- **AI-Enhanced Results**: Every search result is analyzed and categorized by AI
- **Smart Categorization**: Results are automatically classified as educational, tutorial, reference, tool, or general content
- **Relevance Scoring**: Advanced algorithm calculates relevance scores for better ranking
- **AI Summaries**: Generated summaries provide quick insights into content
- **Related Questions**: AI suggests relevant follow-up questions

### 🖼️ Image Search
- **High-Quality Results**: Advanced filtering for high-resolution images
- **Multiple Formats**: Support for various image types and sizes
- **Safe Search**: Built-in content filtering for educational environments
- **Metadata Extraction**: Detailed image information including dimensions and source
- **Advanced Filtering**: Size, type, color, and usage rights filters

### 📰 News Search
- **Real-Time News**: Latest articles from reliable news sources
- **Source Verification**: Results from trusted news organizations
- **Date Filtering**: Search within specific time ranges (day, week, month)
- **Category Focus**: Technology, education, science, and general news
- **Publication Metadata**: Date, source, and author information

### 🎓 Academic Search
- **Research Papers**: Access to academic publications and research
- **Citation Data**: Paper citations and impact metrics
- **Author Information**: Detailed author profiles and affiliations
- **Journal Indexing**: Publication venue and peer-review status
- **DOI Links**: Direct access to original publications
- **Abstract Summaries**: AI-enhanced abstract analysis

### 🤖 AI Question & Answer
- **Intelligent Responses**: AI-powered answers with confidence scoring
- **Source Citations**: All answers include source references
- **Related Questions**: Suggested follow-up questions for deeper exploration
- **Context Awareness**: Answers consider educational context and user level
- **Multi-Source Analysis**: Synthesizes information from multiple sources

### 📷 Visual Search
- **Image Analysis**: Upload or provide image URLs for analysis
- **Similar Image Finding**: Locate visually similar content
- **Object Detection**: Identify objects and elements in images
- **Text Extraction**: OCR capabilities for text within images
- **Educational Focus**: Prioritizes educational and academic visual content

## API Configuration

### Environment Variables
```env
# Google Custom Search API Configuration
NEXT_PUBLIC_GOOGLE_SEARCH_API_KEY=your_api_key_here
NEXT_PUBLIC_GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here

# AI Enhancement
GEMINI_API_KEY=your_gemini_api_key_here
```

### Search Engine Setup
1. Create a Google Custom Search Engine at [cse.google.com](https://cse.google.com)
2. Configure search settings and indexed sites
3. Enable Image Search in CSE settings
4. Obtain API key from Google Cloud Console
5. Add credentials to environment variables

## Usage Examples

### Basic Web Search
```typescript
import SearchService from '@/lib/searchService';

const searchService = SearchService.getInstance();

// Enhanced web search
const results = await searchService.enhancedSearch('machine learning', {
  count: 10,
  includeAISummary: true,
  includeRelatedQuestions: true
});
```

### Image Search
```typescript
// Search for images
const imageResults = await searchService.searchImages('artificial intelligence diagrams', {
  count: 20,
  filters: {
    imageSize: 'large',
    imageType: 'photo',
    safeSearch: 'active'
  }
});
```

### News Search
```typescript
// Search for recent news
const newsResults = await searchService.searchNews('AI education', {
  count: 15,
  category: 'technology',
  dateRange: 'week'
});
```

### Academic Search
```typescript
// Search for research papers
const academicResults = await searchService.searchAcademic('neural networks', {
  count: 10,
  subject: 'computer science',
  dateRange: 'year'
});
```

### AI Question Answering
```typescript
// Get AI-powered answers
const answer = await searchService.answerQuestion('How do neural networks work?', {
  searchCount: 8,
  includeContext: true
});
```

### Visual Search
```typescript
// Search by image
const visualResults = await searchService.visualSearch('https://example.com/image.jpg', {
  count: 15,
  includeText: true
});
```

## Advanced Features

### Multi-Modal Search
Combine text, image, and voice inputs for comprehensive search:

```typescript
const multiModalResults = await searchService.multiModalSearch({
  text: 'machine learning algorithms',
  imageUrl: 'https://example.com/diagram.jpg',
  audioTranscript: 'explain neural networks'
}, {
  count: 20,
  mode: 'comprehensive'
});
```

### Search Filters
Advanced filtering options for precise results:

```typescript
const filters = {
  dateRange: 'month',
  fileType: 'pdf',
  site: 'edu',
  language: 'en',
  safeSearch: 'active',
  sortBy: 'relevance',
  exactTerms: 'machine learning',
  excludeTerms: 'beginner',
  region: 'us'
};
```

### Educational Content Prioritization
Specialized search for educational materials:

```typescript
const educationalResults = await searchService.searchEducationalContent(
  'Mathematics',
  'calculus derivatives',
  {
    level: 'intermediate',
    contentType: 'tutorial',
    count: 15
  }
);
```

## UI Components

The search system includes comprehensive UI components:

- **Search Interface**: Multi-tab search with mode selection
- **Results Display**: Optimized layouts for different content types
- **Filter Panel**: Advanced filtering options
- **AI Insights**: Confidence scores and related suggestions
- **Visual Gallery**: Grid layout for image results
- **Academic Cards**: Specialized display for research papers

## Performance Optimizations

### Caching Strategy
- Search suggestions cached for 5 minutes
- Image thumbnails cached locally
- API responses cached based on query parameters

### Rate Limiting
- Built-in request throttling
- Exponential backoff for failed requests
- Queue management for concurrent searches

### Error Handling
- Graceful degradation when APIs are unavailable
- User-friendly error messages
- Automatic retry mechanisms

## Integration with EduGenius

### Dashboard Integration
- Search accessible from main navigation
- Voice command support: "search for [query]"
- Bookmark integration for saving results
- History tracking for repeated searches

### AI Enhancement
- Integration with existing Genkit AI flows
- Personalized results based on user profile
- Educational context awareness
- Learning path recommendations

### Notification System
- Search result notifications
- New content alerts for saved queries
- Academic paper publication notifications

## Security and Privacy

### Content Filtering
- Safe search enabled by default
- Educational content prioritization
- Age-appropriate result filtering
- Source verification and trust scoring

### Data Protection
- No storage of personal search queries
- Encrypted API communications
- GDPR compliance for EU users
- Configurable privacy settings

## Monitoring and Analytics

### Search Analytics
- Query performance metrics
- Result relevance tracking
- User engagement analysis
- Popular search trends

### API Usage Monitoring
- Request quotas and limits
- Error rate tracking
- Response time optimization
- Cost analysis and budgeting

## Troubleshooting

### Common Issues
1. **API Key Not Working**: Verify credentials in environment variables
2. **No Results Returned**: Check search engine configuration
3. **Slow Performance**: Implement caching and reduce result count
4. **Image Search Failing**: Ensure image search is enabled in CSE

### Debug Mode
Enable debug logging for detailed error information:

```typescript
// Enable debug mode
const searchService = SearchService.getInstance();
searchService.setDebugMode(true);
```

## Future Enhancements

### Planned Features
- Voice search integration
- Real-time collaboration on search results
- Automated research assistance
- Advanced natural language processing
- Machine learning-based personalization

### API Expansions
- Integration with additional academic databases
- Social media search capabilities
- Video content search and analysis
- Podcast and audio content discovery

## Support and Documentation

### Resources
- [Google Custom Search API Documentation](https://developers.google.com/custom-search/v1/overview)
- [Gemini AI API Documentation](https://ai.google.dev/docs)
- [EduGenius Developer Guide](./DEVELOPER_GUIDE.md)

### Community
- GitHub Issues for bug reports
- Discord community for support
- Documentation wiki for contributions

---

This advanced search system represents a significant enhancement to EduGenius, providing users with powerful tools for discovery, research, and learning across multiple content types and formats.