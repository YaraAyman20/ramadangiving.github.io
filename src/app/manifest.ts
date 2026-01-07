import { MetadataRoute } from 'next';

// Required for static export
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ramadan Giving',
    short_name: 'RG',
    description: 'Building Bridges of Hope - Community charity providing food relief and programs',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2D6E7A',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/assets/images/logo.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
        purpose: 'any',
      },
      {
        src: '/assets/images/logo.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'maskable',
      },
    ],
    categories: ['charity', 'nonprofit', 'community'],
  };
}

