# 📊 Google Analytics 4 Integration Guide

## 🌟 Overview
This document provides a comprehensive guide to the Google Analytics 4 (GA4) implementation in the EduGenius platform. The integration uses Measurement ID `G-KQZSD36CPE` and includes both automatic and custom event tracking.

## 🚀 Quick Start

### 1. Prerequisites
- Google Analytics 4 property set up
- Editor access to the GA4 property
- Next.js 13+ project

### 2. Environment Setup
Add the following to your `.env.local` file:
```bash
# Google Analytics 4 Measurement ID
NEXT_PUBLIC_GA_TRACKING_ID=G-KQZSD36CPE

# Optional: Enable debug mode in development
NEXT_PUBLIC_GA_DEBUG=false
```

### 3. Installation
No additional packages needed - the integration uses the official Google Analytics gtag.js script.

## 🛠️ Implementation Details

### Core Components

#### 1. Google Analytics Component
Location: `/src/components/seo/GoogleAnalytics.tsx`
- Handles script loading and initialization
- Manages consent and debugging
- Provides tracking utilities

#### 2. Custom Hooks
Location: `/src/hooks/useGoogleAnalytics.ts`
- `useGoogleAnalytics()`: Automatically tracks page views
- `useTrackEvent()`: Hook for tracking custom events

### Key Features

#### 📌 Automatic Tracking
- Page views and navigation
- Session duration and engagement
- Device and browser information
- First-party cookie support

#### 🎯 Custom Events
```typescript
// Example: Track test generation
trackEvent('generate_test', {
  category: 'Assessment',
  label: 'Mathematics',
  value: 1
});

// Example: Track content interaction
trackEvent('content_interaction', {
  content_type: 'video',
  item_id: 'math-101-intro',
  method: 'play'
});
```

#### 🔄 User Properties
Track user-specific data:
```typescript
// Set user properties
gtag('set', 'user_properties', {
  user_type: 'premium',
  subscription_plan: 'pro',
  total_courses_enrolled: 5
});
```

## 📊 Event Reference

### Standard Events
| Event Name | Description | Parameters |
|------------|-------------|------------|
| `page_view` | Tracks page views | `page_title`, `page_location` |
| `login` | User login | `method` (google, email, etc.) |
| `search` | Site search | `search_term` |
| `select_content` | Content selection | `content_type`, `item_id` |

### Custom Events
| Event Name | Description | Parameters |
|------------|-------------|------------|
| `generate_test` | Test generation | `subject`, `difficulty` |
| `complete_lesson` | Lesson completion | `lesson_id`, `time_spent` |
| `purchase_course` | Course purchase | `value`, `currency`, `items` |

## 🧪 Testing & Debugging

### 1. Development Mode
Set `NEXT_PUBLIC_GA_DEBUG=true` in `.env.local` to enable debug mode.

### 2. Real-time Reports
1. Go to [GA4 Real-time Report](https://analytics.google.com/analytics/web/#/realtime)
2. Verify events are being received

### 3. DebugView
1. Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
2. Open Chrome DevTools (F12)
3. Check the Console and Network tabs for GA events

## 📈 Advanced Configuration

### 1. Custom Dimensions
Add to your GA4 property:
1. Go to Admin > Custom Definitions > Custom Dimensions
2. Create dimensions for:
   - `user_role`
   - `course_id`
   - `content_type`

### 2. Conversion Events
Set up key events as conversions:
1. Go to Admin > Events
2. Toggle "Mark as conversion" for important events

### 3. Funnels
Create conversion funnels:
1. Go to Reports > Engagement > Funnel Analysis
2. Set up funnels for key user journeys

## 🔒 Privacy & Compliance

### 1. Cookie Consent
- Implements cookie consent check before loading GA
- Respects "Do Not Track" browser settings
- Includes IP anonymization

### 2. Data Retention
- User and event data retention: 26 months
- Reset on new activity: Enabled

### 3. GDPR Compliance
- Data processing terms accepted
- Data processing location: United States
- Data sharing settings optimized for compliance

## 📚 Additional Resources

- [GA4 Documentation](https://developers.google.com/analytics)
- [GTag.js Reference](https://developers.google.com/tag-platform/gtagjs/reference)
- [Next.js Analytics](https://nextjs.org/docs/advanced-features/measuring-performance)

## 🚨 Troubleshooting

### Common Issues
1. **No data in reports**
   - Check if the GA4 property is properly set up
   - Verify the Measurement ID matches your property
   - Ensure the gtag script is loading (check Network tab)

2. **Events not showing**
   - Check console for errors
   - Verify event names match exactly
   - Check if ad blockers are interfering

3. **Debug mode not working**
   - Clear site data and hard refresh
   - Ensure `NEXT_PUBLIC_GA_DEBUG` is set to `true`

## 📞 Support
For additional help:
1. Check the [GA4 Help Center](https://support.google.com/analytics/)
2. Open an issue in our repository
3. Contact your Google Analytics representative

## 📊 Usage Examples

### Track Educational Events
```tsx
import { useTrackEvent } from '@/hooks/useGoogleAnalytics';

const { trackTestGenerated, trackEssayEvaluated, trackFeatureUsed } = useTrackEvent();

// Track when a test is generated
trackTestGenerated('Mathematics', 'Intermediate');

// Track essay evaluation
trackEssayEvaluated(500, 85); // 500 words, 85% score

// Track feature usage
trackFeatureUsed('AI Chat Assistant');
```

### Manual Event Tracking
```tsx
import { trackEvent } from '@/components/seo/GoogleAnalytics';

// Track custom events
trackEvent('button_click', 'Navigation', 'Header Menu');
trackEvent('search', 'Site Search', searchQuery);
```

### Automatic Page View Tracking
```tsx
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics';

// Add to any page component for automatic tracking
export default function MyPage() {
  useGoogleAnalytics(); // Automatically tracks page views
  
  return <div>My Page Content</div>;
}
```

## 🔧 Implementation Details

### Files Created/Modified:
1. `/src/components/seo/GoogleAnalytics.tsx` - Main GA component
2. `/src/hooks/useGoogleAnalytics.ts` - Custom hooks for tracking
3. `/src/app/layout.tsx` - Integration into app layout
4. `/src/app/(dashboard)/admin-dashboard/page.tsx` - Example usage

### Integration Points:
- **Layout**: Automatically loaded on all pages
- **Admin Dashboard**: Tracks admin login events
- **Next.js Compatibility**: Uses Next.js Script component for optimal loading

## 📈 What's Being Tracked

### Automatic Metrics:
- Page views and navigation
- Session duration
- User demographics (if available)
- Device and browser information

### Custom Events:
- Admin dashboard access
- Test generation activities
- Essay evaluation usage
- Feature interactions
- Search queries

## 🚀 Next Steps

You can now:
1. **View Analytics**: Go to [Google Analytics](https://analytics.google.com) with your account
2. **Set up Goals**: Create conversion goals for educational activities
3. **Custom Reports**: Build reports specific to educational metrics
4. **Enhanced eCommerce**: Track premium feature usage (if applicable)

## 🔍 Monitoring

The Google Analytics tracking is now active and will start collecting data immediately. You can:
- Monitor real-time users in GA dashboard
- Track feature adoption rates
- Analyze user behavior patterns
- Measure educational content effectiveness

## 🛡️ Privacy Compliance

The implementation:
- Uses official Google Analytics gtag library
- Respects user privacy settings
- Can be easily extended with cookie consent mechanisms
- Follows GDPR and data protection best practices