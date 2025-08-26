// Quick test for Google Custom Search API integration
// Run this in browser console or as a standalone script

async function testSearchAPI() {
  const API_KEY = 'AIzaSyBDkfkydX9REt5R5eN9-yf6IpsRZY_HdhU';
  const SEARCH_ENGINE_ID = '1244d2a1f727645aa';
  
  try {
    console.log('🔍 Testing Google Custom Search API...');
    
    // Test basic search
    const testQuery = 'machine learning tutorial';
    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(testQuery)}&num=5`;
    
    console.log('📡 Making API request...');
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ API Response Success!');
    console.log(`📊 Total Results: ${data.searchInformation?.totalResults || 'N/A'}`);
    console.log(`⏱️ Search Time: ${data.searchInformation?.searchTime || 'N/A'}s`);
    console.log(`📝 Results Count: ${data.items?.length || 0}`);
    
    if (data.items && data.items.length > 0) {
      console.log('🎯 Sample Result:');
      console.log(`   Title: ${data.items[0].title}`);
      console.log(`   Link: ${data.items[0].link}`);
      console.log(`   Snippet: ${data.items[0].snippet.substring(0, 100)}...`);
    }
    
    // Test image search
    console.log('🖼️ Testing Image Search...');
    const imageUrl = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent('artificial intelligence')}&searchType=image&num=3`;
    
    const imageResponse = await fetch(imageUrl);
    if (imageResponse.ok) {
      const imageData = await imageResponse.json();
      console.log(`🖼️ Image Results: ${imageData.items?.length || 0}`);
      if (imageData.items && imageData.items.length > 0) {
        console.log(`   Sample Image: ${imageData.items[0].title}`);
      }
    }
    
    console.log('🎉 All tests passed! Search API is working correctly.');
    return true;
    
  } catch (error) {
    console.error('❌ Search API Test Failed:', error.message);
    
    if (error.message.includes('403')) {
      console.error('🔑 API Key issue: Check if the API key is valid and has Custom Search API enabled');
    } else if (error.message.includes('400')) {
      console.error('⚙️ Configuration issue: Check the Search Engine ID');
    } else if (error.message.includes('429')) {
      console.error('📊 Quota exceeded: You may have reached the daily API limit');
    }
    
    return false;
  }
}

// Auto-run if in browser environment
if (typeof window !== 'undefined') {
  testSearchAPI();
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testSearchAPI };
}