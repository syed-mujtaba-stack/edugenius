# Google Analytics GTags Implementation Guide

Google Analytics has been enhanced with **GTags (gtag.js)** implementation for the EduGenius platform using tracking ID `G-KQZSD36CPE`.

## 🎯 Enhanced GTags Features

### 1. **Advanced Event Tracking**
- Educational platform-specific events
- AI tool usage analytics
- User engagement metrics with duration tracking
- Admin action monitoring
- Error and performance tracking
- Session and scroll depth tracking

### 2. **Enhanced GTags Configuration**
```javascript
gtag('config', 'G-KQZSD36CPE', {
  // Enhanced educational platform settings
  custom_map: {
    'custom_parameter_1': 'course_subject',
    'custom_parameter_2': 'difficulty_level', 
    'custom_parameter_3': 'user_grade'
  },
  // Privacy compliance
  anonymize_ip: true,
  cookie_expires: 63072000, // 2 years
  // Performance monitoring
  page_load_time: true,
  site_speed_sample_rate: 100
});
```

### 3. **Educational Platform Integration**
- Test generation tracking with subject and difficulty
- Essay evaluation metrics with word count and scores
- Study plan analytics with subjects and duration
- Career counseling insights with interests and recommendations
- Search behavior analysis with query and result tracking

## 📊 Enhanced Tracking Functions

### Core GTags Functions:
```tsx
// Enhanced page view tracking
gtagPageView(url, config?) 

// Enhanced event tracking with custom parameters
gtagEvent(action, parameters?)

// User identification and properties
gtagSetUser(userId, userProperties?)

// Custom dimensions for educational data
gtagSetCustomDimensions(dimensions)

// Enhanced ecommerce tracking
gtagPurchase(transactionId, value, currency, items?)
```

### Educational Event Tracking:
```tsx
// AI Tools tracking
gtagEducationalEvent.trackAIToolUsage(toolName, subject?, difficulty?)

// Assessment tracking
gtagEducationalEvent.trackTestGeneration(subject, difficulty, questionCount)
gtagEducationalEvent.trackEssayEvaluation(wordCount, score, subject?)

// Learning tracking  
gtagEducationalEvent.trackStudyPlanCreation(subjects[], duration, studentGrade?)
gtagEducationalEvent.trackCareerCounseling(interests[], recommendations[])

// User interaction tracking
gtagEducationalEvent.trackSearch(query, searchType, resultsCount?)
gtagEducationalEvent.trackEngagement(action, duration?, contentType?)

// Admin and error tracking
gtagEducationalEvent.trackAdminAction(action, target?, details?)
gtagEducationalEvent.trackError(errorType, errorMessage, page?)
```

## 🚀 Usage Examples

### 1. Automatic Tracking with Hooks
```tsx
import { useGoogleAnalytics, useSessionTracking, useScrollTracking } from '@/hooks/useGoogleAnalytics';

export default function MyPage() {
  // Automatic page view tracking
  useGoogleAnalytics();
  
  // Session duration tracking
  useSessionTracking();
  
  // Scroll depth tracking (25%, 50%, 75%, 100%)
  useScrollTracking();
  
  return <div>My Page Content</div>;
}
```

### 2. Educational Event Tracking
```tsx
import { useTrackEvent } from '@/hooks/useGoogleAnalytics';

const MyComponent = () => {
  const trackEvent = useTrackEvent();
  
  const handleTestGeneration = () => {
    // Track test generation with enhanced data
    trackEvent.trackTestGeneration('Mathematics', 'Advanced', 20);
  };
  
  const handleEssaySubmission = () => {
    // Track essay evaluation with detailed metrics
    trackEvent.trackEssayEvaluation(750, 92, 'English Literature');
  };
  
  const handleSearchQuery = () => {
    // Track search with result count
    trackEvent.trackSearch('quadratic equations', 'academic', 45);
  };
};
```

### 3. User Identification and Custom Properties
```tsx
import { gtagSetUser, gtagSetCustomDimensions } from '@/components/seo/GoogleAnalytics';

// Set user identification
gtagSetUser('user_12345', {
  user_grade: 'Grade 10',
  user_type: 'student',
  subscription: 'premium',
  learning_style: 'visual'
});

// Set custom dimensions for educational analytics
gtagSetCustomDimensions({
  'custom_dimension_1': 'mathematics_focus',
  'custom_dimension_2': 'intermediate_level',
  'custom_dimension_3': 'grade_10'
});
```

### 4. Admin Dashboard Integration
```tsx
import { useTrackEvent } from '@/hooks/useGoogleAnalytics';

const AdminDashboard = () => {
  const { trackAdminAction } = useTrackEvent();
  
  const handleUserManagement = () => {
    trackAdminAction('user_bulk_update', 'users_table', 'Updated 25 user accounts');
  };
  
  const handleSystemMaintenance = () => {
    trackAdminAction('system_backup', 'database', 'Initiated daily backup');
  };
};
```

## 🔧 Implementation Architecture

### File Structure:
```
src/
├── components/seo/
│   └── GoogleAnalytics.tsx     # Enhanced GTags implementation
├── hooks/
│   └── useGoogleAnalytics.ts   # Custom tracking hooks
├── app/
│   ├── layout.tsx              # GTags integration
│   └── (dashboard)/
│       ├── admin-dashboard/    # Admin tracking example
│       └── gtags-test/         # Testing suite
└── docs/
    └── gtags-implementation.md # This documentation
```

### TypeScript Support:
```tsx
// Enhanced type definitions for GTags
interface GTagConfig {
  page_title?: string;
  page_location?: string;
  page_path?: string;
  send_page_view?: boolean;
  custom_map?: Record<string, string>;
  user_id?: string;
  [key: string]: any;
}

interface GTagEvent {
  event_category?: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
  [key: string]: any;
}
```

## 📈 Enhanced Analytics Capabilities

### Educational Metrics:
- **AI Tool Usage**: Track which AI tools are most popular by subject and difficulty
- **Assessment Analytics**: Monitor test generation patterns and essay evaluation scores
- **Learning Paths**: Analyze study plan effectiveness and completion rates
- **Career Guidance**: Track career counseling usage and outcome patterns
- **Search Intelligence**: Understand what students are searching for most

### User Engagement:
- **Session Duration**: Automatic tracking of time spent on platform
- **Scroll Depth**: Monitor content engagement depth
- **Feature Adoption**: Track which features are being used most
- **Error Monitoring**: Identify and track platform issues

### Admin Insights:
- **Dashboard Usage**: Monitor admin activity patterns
- **User Management**: Track administrative actions and bulk operations
- **System Health**: Monitor error rates and performance issues

## 🧪 Testing Suite

Access the comprehensive GTags testing suite at `/gtags-test` to:
- Verify GTags configuration and status
- Test all educational event tracking functions
- Validate custom event and user identification
- Monitor real-time event sending
- Debug tracking implementation

### Test Features:
- ✅ GTags status verification
- ✅ Basic event tracking tests
- ✅ Educational event suite
- ✅ Search and discovery tracking
- ✅ User interaction tests
- ✅ Advanced features testing
- ✅ Custom event creation
- ✅ Real-time results logging

## 🛡️ Privacy & Compliance

### Enhanced Privacy Features:
```javascript
gtag('config', 'G-KQZSD36CPE', {
  // GDPR compliance
  anonymize_ip: true,
  
  // Cookie management
  cookie_expires: 63072000, // 2 years
  
  // Performance monitoring
  page_load_time: true,
  site_speed_sample_rate: 100,
  
  // Development debugging
  debug_mode: (hostname === 'localhost')
});
```

### Compliance Features:
- IP address anonymization enabled
- Configurable cookie expiration
- Debug mode for development
- Graceful fallback when GTags unavailable
- User privacy controls ready for integration

## 🚀 Performance Benefits

### Optimized Loading:
- Uses Next.js Script component with `afterInteractive` strategy
- Minimal impact on page load performance
- Efficient event batching and sending
- Automatic error handling and fallbacks

### Enhanced Data Quality:
- Structured educational event parameters
- Consistent naming conventions
- Rich custom dimensions for educational analytics
- Comprehensive user journey tracking

## 📊 Analytics Dashboard Benefits

With this enhanced GTags implementation, you can now:

1. **Monitor Educational KPIs**: Track test generation rates, essay evaluation scores, and study plan completion
2. **Analyze User Behavior**: Understand how students interact with AI tools and educational content
3. **Optimize Content**: Use search and engagement data to improve educational materials
4. **Track Feature Adoption**: Monitor which new features are being adopted successfully
5. **Identify Issues**: Proactive error monitoring and performance tracking
6. **Admin Insights**: Comprehensive dashboard usage and administrative action tracking

The GTags implementation provides enterprise-level analytics capabilities specifically tailored for educational platforms, enabling data-driven decisions to improve student learning outcomes.