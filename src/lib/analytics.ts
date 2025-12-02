// Privacy-friendly analytics utility
// Supports multiple analytics providers

import { track as vercelTrack } from '@vercel/analytics';

type AnalyticsProvider = 'vercel' | 'plausible' | 'posthog' | 'ga4' | 'none';

interface AnalyticsEvent {
  name: string;
  props?: Record<string, string | number | boolean>;
}

// Get analytics provider from environment
const getProvider = (): AnalyticsProvider => {
  const provider = import.meta.env.VITE_ANALYTICS_PROVIDER as AnalyticsProvider;
  // Default to Vercel Analytics if on Vercel (free!)
  if (!provider && import.meta.env.PROD) {
    return 'vercel';
  }
  return provider || 'vercel';
};

// Check if analytics is enabled
const isEnabled = (): boolean => {
  return getProvider() !== 'none' && import.meta.env.VITE_ANALYTICS_ENABLED !== 'false';
};

// Plausible Analytics
const trackPlausible = (event: AnalyticsEvent) => {
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible(event.name, { props: event.props });
  }
};

// PostHog Analytics
const trackPostHog = (event: AnalyticsEvent) => {
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture(event.name, event.props);
  }
};

// Vercel Analytics
const trackVercel = (event: AnalyticsEvent) => {
  try {
    vercelTrack(event.name, event.props);
  } catch (error) {
    // Silently fail if not on Vercel
    console.debug('Vercel Analytics not available:', error);
  }
};

// Google Analytics 4
const trackGA4 = (event: AnalyticsEvent) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event.name, event.props);
  }
};

/**
 * Track a custom event
 * @param event - Event name and properties
 */
export const trackEvent = (event: AnalyticsEvent): void => {
  if (!isEnabled()) return;

  const provider = getProvider();

  switch (provider) {
    case 'vercel':
      trackVercel(event);
      break;
    case 'plausible':
      trackPlausible(event);
      break;
    case 'posthog':
      trackPostHog(event);
      break;
    case 'ga4':
      trackGA4(event);
      break;
    case 'none':
    default:
      // No tracking
      break;
  }
};

/**
 * Track page views
 * @param path - Page path
 */
export const trackPageView = (path: string): void => {
  if (!isEnabled()) return;

  const provider = getProvider();

  switch (provider) {
    case 'vercel':
      // Vercel Analytics automatically tracks page views via <Analytics /> component
      break;
    case 'plausible':
      // Plausible automatically tracks page views
      break;
    case 'posthog':
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('$pageview', { path });
      }
      break;
    case 'ga4':
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('config', import.meta.env.VITE_GA4_MEASUREMENT_ID, {
          page_path: path,
        });
      }
      break;
    case 'none':
    default:
      break;
  }
};

// Predefined events for common actions
export const AnalyticsEvents = {
  // Editor events
  EDITOR_OPENED: 'Editor Opened',
  SCHEMA_GENERATED: 'Schema Generated',
  PROMPT_GENERATED: 'Prompt Generated',
  SCHEMA_SHRUNK: 'Schema Shrunk',
  SCHEMA_EXPANDED: 'Schema Expanded',
  TOOL_SELECTED: 'Tool Selected',
  MODE_SWITCHED: 'Mode Switched',
  
  // Navigation events
  BUTTON_CLICKED: 'Button Clicked',
  LINK_CLICKED: 'Link Clicked',
  PAGE_VIEWED: 'Page Viewed',
  
  // CTA events
  GET_STARTED_CLICKED: 'Get Started Clicked',
  GITHUB_CLICKED: 'GitHub Clicked',
  LAUNCH_EDITOR_CLICKED: 'Launch Editor Clicked',
  
  // Error events
  ERROR_OCCURRED: 'Error Occurred',
  RATE_LIMIT_HIT: 'Rate Limit Hit',
};

