'use client';

import Script from 'next/script';

// GTags configuration interface
interface GTagConfig {
  page_title?: string;
  page_location?: string;
  page_path?: string;
  send_page_view?: boolean;
  custom_map?: Record<string, string>;
  user_id?: string;
  [key: string]: any;
}

// GTags event parameters interface
interface GTagEvent {
  event_category?: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
  [key: string]: any;
}

export const GoogleAnalytics = () => {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || 'G-KQZSD36CPE';

  return (
    <>
      {/* Google Analytics GTags */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtags-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          
          // Initialize GTags
          gtag('js', new Date());
          
          // Configure Google Analytics with enhanced settings
          gtag('config', '${GA_TRACKING_ID}', {
            page_title: document.title,
            page_location: window.location.href,
            send_page_view: true,
            // Enhanced eCommerce settings for educational platform
            custom_map: {
              'custom_parameter_1': 'course_subject',
              'custom_parameter_2': 'difficulty_level',
              'custom_parameter_3': 'user_grade'
            },
            // Privacy settings
            anonymize_ip: true,
            cookie_expires: 63072000, // 2 years
            // Performance settings
            page_load_time: true,
            site_speed_sample_rate: 100
          });
          
          // Debug mode for development
          if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            gtag('config', '${GA_TRACKING_ID}', {
              debug_mode: true
            });
          }
        `}
      </Script>
      {/* End Google Analytics GTags */}
    </>
  );
};

// GTags utility functions for page tracking
export const gtagPageView = (url: string, config?: GTagConfig) => {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || 'G-KQZSD36CPE';
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
      ...config
    });
  }
};

// GTags utility for event tracking
export const gtagEvent = (action: string, parameters?: GTagEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: parameters?.event_category || 'General',
      event_label: parameters?.event_label,
      value: parameters?.value,
      ...parameters
    });
  }
};

// Enhanced GTags functions for educational platform
export const gtagEducationalEvent = {
  // Track AI tool usage
  trackAIToolUsage: (toolName: string, subject?: string, difficulty?: string) => {
    gtagEvent('ai_tool_used', {
      event_category: 'AI Tools',
      event_label: toolName,
      custom_parameters: {
        tool_name: toolName,
        subject: subject,
        difficulty_level: difficulty
      }
    });
  },

  // Track test generation
  trackTestGeneration: (subject: string, difficulty: string, questionCount: number) => {
    gtagEvent('test_generated', {
      event_category: 'Assessment',
      event_label: `${subject} - ${difficulty}`,
      value: questionCount,
      custom_parameters: {
        subject: subject,
        difficulty_level: difficulty,
        question_count: questionCount
      }
    });
  },

  // Track essay evaluation
  trackEssayEvaluation: (wordCount: number, score: number, subject?: string) => {
    gtagEvent('essay_evaluated', {
      event_category: 'Assessment',
      event_label: `${wordCount} words`,
      value: score,
      custom_parameters: {
        word_count: wordCount,
        essay_score: score,
        subject: subject
      }
    });
  },

  // Track study plan creation
  trackStudyPlanCreation: (subjects: string[], duration: string, studentGrade?: string) => {
    gtagEvent('study_plan_created', {
      event_category: 'Learning',
      event_label: `${subjects.length} subjects - ${duration}`,
      custom_parameters: {
        subjects: subjects.join(', '),
        plan_duration: duration,
        student_grade: studentGrade
      }
    });
  },

  // Track career counseling
  trackCareerCounseling: (interests: string[], recommendedCareers: string[]) => {
    gtagEvent('career_counseling_completed', {
      event_category: 'Career',
      event_label: `${interests.length} interests`,
      custom_parameters: {
        user_interests: interests.join(', '),
        recommended_careers: recommendedCareers.join(', ')
      }
    });
  },

  // Track search usage
  trackSearch: (query: string, searchType: string, resultsCount?: number) => {
    gtagEvent('search', {
      search_term: query,
      event_category: 'Search',
      event_label: searchType,
      value: resultsCount,
      custom_parameters: {
        search_query: query,
        search_type: searchType,
        results_count: resultsCount
      }
    });
  },

  // Track user engagement
  trackEngagement: (action: string, duration?: number, contentType?: string) => {
    gtagEvent(action, {
      event_category: 'Engagement',
      event_label: contentType,
      value: duration,
      custom_parameters: {
        engagement_type: action,
        duration_seconds: duration,
        content_type: contentType
      }
    });
  },

  // Track admin actions
  trackAdminAction: (action: string, target?: string, details?: string) => {
    gtagEvent('admin_action', {
      event_category: 'Admin',
      event_label: action,
      custom_parameters: {
        admin_action: action,
        target: target,
        details: details
      }
    });
  },

  // Track errors and issues
  trackError: (errorType: string, errorMessage: string, page?: string) => {
    gtagEvent('exception', {
      description: errorMessage,
      fatal: false,
      event_category: 'Error',
      custom_parameters: {
        error_type: errorType,
        error_message: errorMessage,
        page_path: page || window.location.pathname
      }
    });
  }
};

// Legacy functions for backward compatibility
export const trackPageView = gtagPageView;
export const trackEvent = gtagEvent;

// Enhanced TypeScript declarations for GTags
declare global {
  interface Window {
    gtag: {
      (command: 'config', targetId: string, config?: GTagConfig): void;
      (command: 'event', eventName: string, eventParameters?: GTagEvent): void;
      (command: 'js', date: Date): void;
      (command: 'set', config: Record<string, any>): void;
      (command: 'get', targetId: string, fieldName: string, callback: (value: any) => void): void;
      (...args: any[]): void;
    };
    dataLayer: any[];
  }
}

// GTags helper for setting user properties
export const gtagSetUser = (userId: string, userProperties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID || 'G-KQZSD36CPE', {
      user_id: userId,
      custom_map: userProperties
    });
  }
};

// GTags helper for setting custom dimensions
export const gtagSetCustomDimensions = (dimensions: Record<string, string>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', dimensions);
  }
};

// GTags helper for enhanced ecommerce (for premium features)
export const gtagPurchase = (transactionId: string, value: number, currency: string = 'USD', items?: any[]) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items
    });
  }
};