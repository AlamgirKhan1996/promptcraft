// app/robots.ts
// Generates robots.txt automatically
// Access at: promptifill.com/robots.txt

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/generate',
          '/build',
          '/templates',
          '/pricing',
          '/contact',
          '/terms',
          '/privacy',
          '/refund',
          '/idm',
        ],
        disallow: [
          '/dashboard',     // private
          '/library',       // private
          '/settings',      // private
          '/team',          // private
          '/api/',          // never index API routes
          '/generate?*',    // block ALL query param versions
          '/templates?*',   // prevents ?page=1 duplicate
          '/library?*',     // prevents pagination duplicates
          '/*?*',           // block ALL pages with query params
        ],
      },
    ],
    sitemap: 'https://promptifill.com/sitemap.xml',
    host: 'https://promptifill.com',
  };
}
