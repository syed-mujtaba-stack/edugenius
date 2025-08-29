"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gtagPageView, gtagEducationalEvent } from '@/components/seo/GoogleAnalytics';

// Hook to automatically track page views on route changes using GTags
export const useGoogleAnalytics = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      gtagPageView(pathname);
    }
  }, [pathname]);
};

// Enhanced hook for tracking educational platform events with GTags
export const useTrackEvent = () => {
  return {
    // AI Tools tracking
    trackAIToolUsage: gtagEducationalEvent.trackAIToolUsage,
    trackTestGeneration: gtagEducationalEvent.trackTestGeneration,
    trackEssayEvaluation: gtagEducationalEvent.trackEssayEvaluation,
    trackStudyPlanCreation: gtagEducationalEvent.trackStudyPlanCreation,
    trackCareerCounseling: gtagEducationalEvent.trackCareerCounseling,
    
    // Platform interaction tracking
    trackSearch: gtagEducationalEvent.trackSearch,
    trackEngagement: gtagEducationalEvent.trackEngagement,
    trackAdminAction: gtagEducationalEvent.trackAdminAction,
    trackError: gtagEducationalEvent.trackError,
    
    // Generic feature tracking
    trackFeatureUsed: (featureName: string, category: string = 'Feature Usage') => {
      gtagEducationalEvent.trackAIToolUsage(featureName, undefined, undefined);
    },
    
    // Backward compatibility for existing code
    trackTestGenerated: (subject: string, difficulty: string) => {
      gtagEducationalEvent.trackTestGeneration(subject, difficulty, 10); // default 10 questions
    },
    
    trackEssayEvaluated: (wordCount: number, score: number) => {
      gtagEducationalEvent.trackEssayEvaluation(wordCount, score);
    }
  };
};

// Hook for tracking user sessions and time on page
export const useSessionTracking = () => {
  useEffect(() => {
    const startTime = Date.now();
    
    const handleBeforeUnload = () => {
      const sessionDuration = Math.round((Date.now() - startTime) / 1000);
      gtagEducationalEvent.trackEngagement('session_duration', sessionDuration, 'page_session');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      const sessionDuration = Math.round((Date.now() - startTime) / 1000);
      gtagEducationalEvent.trackEngagement('session_duration', sessionDuration, 'page_session');
    };
  }, []);
};

// Hook for tracking scroll depth
export const useScrollTracking = () => {
  useEffect(() => {
    let maxScroll = 0;
    
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // Track milestone scroll depths
        if ([25, 50, 75, 100].includes(scrollPercent)) {
          gtagEducationalEvent.trackEngagement('scroll_depth', scrollPercent, 'page_scroll');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
};
