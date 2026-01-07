import { MetadataRoute } from 'next';

// Required for static export
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://ramadangiving.github.io';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/static/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

