'use server';
/**
 * Performance Optimization AI Agent
 * Provides AI-powered recommendations for website performance optimization
 * Powered by Google AI and Gemini model
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input schema for performance optimization analysis
const PerformanceOptimizationInputSchema = z.object({
  url: z.string().url().describe('The website URL to analyze for performance optimization'),
  currentScore: z.number().min(0).max(100).describe('Current PageSpeed Insights performance score'),
  metrics: z.object({
    firstContentfulPaint: z.number().describe('First Contentful Paint time in milliseconds'),
    largestContentfulPaint: z.number().describe('Largest Contentful Paint time in milliseconds'),
    cumulativeLayoutShift: z.number().describe('Cumulative Layout Shift score'),
    firstInputDelay: z.number().optional().describe('First Input Delay time in milliseconds'),
    speedIndex: z.number().describe('Speed Index score'),
    timeToInteractive: z.number().describe('Time to Interactive in milliseconds')
  }).describe('Current performance metrics from PageSpeed Insights'),
  opportunities: z.array(z.object({
    id: z.string().describe('Opportunity identifier'),
    title: z.string().describe('Opportunity title'),
    description: z.string().describe('Opportunity description'),
    savings: z.string().optional().describe('Potential savings from this optimization')
  })).describe('Performance improvement opportunities identified'),
  platform: z.enum(['educational', 'ecommerce', 'blog', 'corporate', 'other']).describe('Type of website platform'),
  targetAudience: z.string().describe('Primary target audience (e.g., students, professionals, general users)'),
  primaryGoals: z.array(z.string()).describe('Primary website goals (e.g., user engagement, conversions, learning outcomes)')
})

export type PerformanceOptimizationInput = z.infer<typeof PerformanceOptimizationInputSchema>;

// Output schema for performance recommendations
const PerformanceOptimizationOutputSchema = z.object({
  overallAssessment: z.object({
    currentGrade: z.enum(['A', 'B', 'C', 'D', 'F']).describe('Current performance grade'),
    targetGrade: z.enum(['A', 'B', 'C', 'D', 'F']).describe('Achievable target grade'),
    priorityLevel: z.enum(['critical', 'high', 'medium', 'low']).describe('Overall optimization priority'),
    impactEstimate: z.string().describe('Estimated impact on user experience and business goals')
  }).describe('Overall performance assessment'),
  
  coreWebVitalsOptimization: z.object({
    lcpRecommendations: z.array(z.string()).describe('Specific recommendations for improving Largest Contentful Paint'),
    fidRecommendations: z.array(z.string()).describe('Specific recommendations for improving First Input Delay'),
    clsRecommendations: z.array(z.string()).describe('Specific recommendations for improving Cumulative Layout Shift'),
    implementationOrder: z.array(z.string()).describe('Recommended order of implementation for maximum impact')
  }).describe('Core Web Vitals specific optimization strategies'),
  
  implementationPlan: z.object({
    quickWins: z.array(z.string()).describe('Easy optimizations that can be implemented immediately'),
    shortTerm: z.array(z.string()).describe('Optimizations to implement within 1-2 weeks'),
    longTerm: z.array(z.string()).describe('Major optimizations for long-term performance gains'),
    expectedResults: z.object({
      scoreImprovement: z.string().describe('Expected PageSpeed score improvement'),
      userExperienceGains: z.array(z.string()).describe('Expected user experience improvements'),
      businessMetrics: z.array(z.string()).describe('Expected business/educational metric improvements')
    }).describe('Expected results from implementing the optimization plan')
  }).describe('Comprehensive implementation roadmap')
});
export type PerformanceOptimizationOutput = z.infer<typeof PerformanceOptimizationOutputSchema>;

export async function optimizePerformance(input: PerformanceOptimizationInput): Promise<PerformanceOptimizationOutput> {
  return performanceOptimizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'performanceOptimizationPrompt',
  input: { schema: PerformanceOptimizationInputSchema },
  output: { schema: PerformanceOptimizationOutputSchema },
  prompt: `You are an expert web performance optimization consultant specializing in {{platform}} platforms.

Website Analysis:
- URL: {{url}}
- Current Performance Score: {{currentScore}}/100
- Platform Type: {{platform}}
- Target Audience: {{targetAudience}}
- Primary Goals: {{primaryGoals}}

Current Performance Metrics:
- First Contentful Paint: {{metrics.firstContentfulPaint}}ms
- Largest Contentful Paint: {{metrics.largestContentfulPaint}}ms
- Cumulative Layout Shift: {{metrics.cumulativeLayoutShift}}
- First Input Delay: {{metrics.firstInputDelay}}ms
- Speed Index: {{metrics.speedIndex}}ms
- Time to Interactive: {{metrics.timeToInteractive}}ms

Identified Opportunities:
{{#each opportunities}}
- {{title}}: {{description}}{{#if savings}} (Potential savings: {{savings}}){{/if}}
{{/each}}

Please provide a comprehensive performance optimization strategy that includes:

1. **Overall Assessment**: Current grade, realistic target grade, priority level, and impact estimate
2. **Core Web Vitals Optimization**: Specific strategies for LCP, FID, and CLS improvements
3. **Implementation Plan**: Quick wins, short-term, and long-term strategies with expected results

Focus on:
- Actionable, specific recommendations
- Implementation difficulty and impact assessment
- Expected business/user experience outcomes
- Realistic timelines and expectations

For educational platforms specifically, consider:
- Student engagement and attention spans
- Mobile-first optimization for student devices
- Accessibility requirements
- Content delivery optimization for multimedia learning materials
- Real-time features like video streaming and interactive tools`,
});

const performanceOptimizationFlow = ai.defineFlow(
  {
    name: 'performanceOptimizationFlow',
    inputSchema: PerformanceOptimizationInputSchema,
    outputSchema: PerformanceOptimizationOutputSchema,
  },
  async (input: PerformanceOptimizationInput) => {
    try {
      const { output } = await prompt(input);
      
      // If AI fails, provide structured fallback
      if (!output) {
        return generateFallbackRecommendations(input);
      }
      
      return output;
    } catch (error) {
      console.error('Performance optimization flow error:', error);
      return generateFallbackRecommendations(input);
    }
  }
);

// Fallback recommendations when AI is unavailable
function generateFallbackRecommendations(input: PerformanceOptimizationInput): PerformanceOptimizationOutput {
  const currentGrade = input.currentScore >= 90 ? 'A' as const : 
                     input.currentScore >= 80 ? 'B' as const : 
                     input.currentScore >= 70 ? 'C' as const : 
                     input.currentScore >= 50 ? 'D' as const : 'F' as const;
  
  return {
    overallAssessment: {
      currentGrade,
      targetGrade: input.currentScore < 50 ? 'C' : input.currentScore < 70 ? 'B' : 'A',
      priorityLevel: input.currentScore < 50 ? 'critical' : input.currentScore < 70 ? 'high' : 'medium',
      impactEstimate: 'Significant improvement in user experience and performance metrics expected'
    },
    
    coreWebVitalsOptimization: {
      lcpRecommendations: [
        input.metrics.largestContentfulPaint > 2500 ? 'Optimize server response time and implement CDN' : 'Fine-tune existing LCP optimizations',
        'Implement image optimization and lazy loading',
        'Minimize render-blocking resources',
        'Use resource hints (preload, prefetch) for critical resources'
      ],
      fidRecommendations: [
        'Minimize main thread work by code splitting',
        'Remove or defer non-essential JavaScript',
        'Implement efficient event handlers',
        'Use web workers for heavy computations'
      ],
      clsRecommendations: [
        'Set explicit dimensions for images and embeds',
        'Reserve space for dynamically loaded content',
        'Avoid inserting content above existing content',
        'Use CSS transform animations instead of layout changes'
      ],
      implementationOrder: [
        'Address server response time issues',
        'Implement image optimizations',
        'Optimize JavaScript loading and execution',
        'Fix layout stability issues'
      ]
    },
    
    implementationPlan: {
      quickWins: [
        'Enable text compression (gzip/brotli)',
        'Optimize images with modern formats',
        'Remove unused CSS and JavaScript',
        'Implement browser caching headers'
      ],
      shortTerm: [
        'Implement code splitting and lazy loading',
        'Optimize third-party script loading',
        'Set up CDN for static assets',
        'Improve server response times'
      ],
      longTerm: [
        'Implement advanced caching strategies',
        'Consider server-side rendering optimizations',
        'Implement performance monitoring dashboard',
        'Regular performance audits and optimization cycles'
      ],
      expectedResults: {
        scoreImprovement: `Expected improvement: ${Math.min(100 - input.currentScore, 25)}-${Math.min(100 - input.currentScore, 40)} points`,
        userExperienceGains: [
          'Faster page load times',
          'Improved interactivity',
          'Better visual stability',
          'Enhanced mobile experience'
        ],
        businessMetrics: [
          'Increased user engagement',
          'Higher conversion rates',
          'Improved SEO rankings',
          'Better user satisfaction scores'
        ]
      }
    }
  };
}