'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Web Vitals reporting
export function reportWebVitals(metric: {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: string;
}) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    const color = 
      metric.rating === 'good' ? '\x1b[32m' : 
      metric.rating === 'needs-improvement' ? '\x1b[33m' : '\x1b[31m';
    
    console.log(
      `${color}[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})\x1b[0m`
    );
  }

  // Send to analytics in production
  // Example: Send to Google Analytics
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
}

// Page view tracking component
export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page views
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // Example: Google Analytics pageview
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: url,
      });
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] Page view: ${url}`);
    }
  }, [pathname, searchParams]);

  return null;
}

// Performance observer for custom metrics
export function usePerformanceObserver() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Observe Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('[Performance] LCP:', lastEntry.startTime.toFixed(2), 'ms');
    });

    // Observe First Input Delay
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        console.log('[Performance] FID:', entry.processingStart - entry.startTime, 'ms');
      });
    });

    // Observe Layout Shifts
    const clsObserver = new PerformanceObserver((entryList) => {
      let clsValue = 0;
      entryList.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      console.log('[Performance] CLS:', clsValue.toFixed(4));
    });

    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      fidObserver.observe({ type: 'first-input', buffered: true });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // Some browsers don't support all metric types
    }

    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);
}

