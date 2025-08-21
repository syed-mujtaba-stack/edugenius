/** @type {import('next-sitemap').IConfig} */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://edugenius.pk';

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: [
    '/api/*',
    '/admin/*',
    '/dashboard/*',
    '/_error',
    '/_404',
    '/_500',
    '/server-sitemap.xml'
  ],
  robotsTxtOptions: {
    policies: [
      { 
        userAgent: '*', 
        allow: '/',
        disallow: ['/api/*', '/admin/*', '/dashboard/*']
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 10
      }
    ],
    additionalSitemaps: [
      `${siteUrl}/sitemap.xml`,
      `${siteUrl}/server-sitemap.xml`
    ],
  },
  transform: async (config, path) => {
    // Set priority based on page type
    let priority = 0.7;
    let changefreq = 'weekly';
    
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.startsWith('/courses') || path.startsWith('/study')) {
      priority = 0.9;
      changefreq = 'daily';
    } else if (path.startsWith('/blog')) {
      priority = 0.8;
      changefreq = 'daily';
    } else if (path.startsWith('/dashboard')) {
      priority = 0.3;
      changefreq = 'monthly';
    }
    
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
