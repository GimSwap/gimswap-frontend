import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.gimswap.com',
      lastModified: new Date(),
      alternates: {
        languages: {
          en: 'https://www.gimswap.com/en',
        },
      },
    },
    {
      url: 'https://www.gimswap.com/swap',
      lastModified: new Date(),
      alternates: {
        languages: {
          en: 'https://www.gimswap.com/en/swap',
        },
      },
    },
  ];
}
