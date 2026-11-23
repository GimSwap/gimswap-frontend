import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const envMode = process.env.NEXT_PUBLIC_ENV_MODE;
  const disallow = envMode === 'production' ? '/private/' : '/';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow,
    },
    sitemap: 'https://www.gimswap.com/sitemap.xml',
  };
}
