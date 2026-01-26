"use client";

import { useState, useEffect } from "react";

/**
 * Hook to fetch campaign image from external URL's Open Graph metadata
 * Fetches og:image meta tag from the campaign URL
 */
export function useCampaignImage(externalUrl: string | null | undefined) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!externalUrl) {
      setImageUrl(null);
      return;
    }

    // Check if we already have it cached
    const cacheKey = `campaign-image-${externalUrl}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setImageUrl(cached);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Use a CORS proxy to fetch the page HTML
    // This allows us to bypass CORS restrictions
    const fetchImage = async () => {
      try {
        // Try multiple CORS proxies (fallback if one fails)
        const proxies = [
          `https://api.allorigins.win/get?url=${encodeURIComponent(externalUrl)}`,
          `https://corsproxy.io/?${encodeURIComponent(externalUrl)}`,
        ];

        let html = null;
        for (const proxyUrl of proxies) {
          try {
            const response = await fetch(proxyUrl, {
              method: 'GET',
              headers: {
                'Accept': 'text/html',
              },
            });
            
            if (response.ok) {
              const data = await response.json();
              html = data.contents || data;
              break;
            }
          } catch (e) {
            // Try next proxy
            continue;
          }
        }

        if (!html) {
          // Fallback: Try to construct image URL based on platform
          if (externalUrl.includes('gofundme.com')) {
            const campaignMatch = externalUrl.match(/gofundme\.com\/f\/([^/?]+)/);
            if (campaignMatch) {
              // GoFundMe widget images are often available at this pattern
              const potentialImageUrl = `https://www.gofundme.com/static/media/campaigns/${campaignMatch[1]}.jpg`;
              setImageUrl(potentialImageUrl);
              sessionStorage.setItem(cacheKey, potentialImageUrl);
            }
          }
          setIsLoading(false);
          return;
        }

        // Parse HTML to find og:image (most reliable)
        const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                              html.match(/<meta\s+name=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                              html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);
        
        if (ogImageMatch && ogImageMatch[1]) {
          let imageUrl = ogImageMatch[1];
          // Ensure absolute URL
          if (imageUrl.startsWith('//')) {
            imageUrl = `https:${imageUrl}`;
          } else if (imageUrl.startsWith('/')) {
            const urlObj = new URL(externalUrl);
            imageUrl = `${urlObj.origin}${imageUrl}`;
          }
          
          setImageUrl(imageUrl);
          sessionStorage.setItem(cacheKey, imageUrl);
          setIsLoading(false);
          return;
        }

        // Fallback: Try to find large images in the page
        const imgMatches = html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi);
        for (const match of imgMatches) {
          if (match[1]) {
            let imageUrl = match[1];
            // Skip small icons, logos, etc.
            if (imageUrl.includes('icon') || imageUrl.includes('logo') || imageUrl.includes('avatar')) {
              continue;
            }
            // Ensure absolute URL
            if (imageUrl.startsWith('//')) {
              imageUrl = `https:${imageUrl}`;
            } else if (imageUrl.startsWith('/')) {
              const urlObj = new URL(externalUrl);
              imageUrl = `${urlObj.origin}${imageUrl}`;
            }
            // Only use if it's a full URL and looks like a campaign image
            if (imageUrl.startsWith('http') && (imageUrl.includes('campaign') || imageUrl.includes('fundraiser') || imageUrl.match(/\.(jpg|jpeg|png|webp)/i))) {
              setImageUrl(imageUrl);
              sessionStorage.setItem(cacheKey, imageUrl);
              setIsLoading(false);
              return;
            }
          }
        }

        // Last resort: Try platform-specific patterns
        if (externalUrl.includes('gofundme.com')) {
          const campaignMatch = externalUrl.match(/gofundme\.com\/f\/([^/?]+)/);
          if (campaignMatch) {
            const potentialImageUrl = `https://www.gofundme.com/static/media/campaigns/${campaignMatch[1]}.jpg`;
            setImageUrl(potentialImageUrl);
            sessionStorage.setItem(cacheKey, potentialImageUrl);
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching campaign image:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch image");
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [externalUrl]);

  return { imageUrl, isLoading, error };
}
