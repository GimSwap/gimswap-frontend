import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    config.resolve.fallback = {
      fs: false,
    };
    return config;
  },
  images: {
    formats: ['image/webp'], // JPG 변환 방지
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'objectstorage.kr-central-2.kakaocloud.com',
      },
      {
        protocol: 'https',
        hostname: '*.kakaoiedge.com', // Kakao CDN 추가
      },
    ],
  },
  reactStrictMode: false,
};

export default withNextIntl(nextConfig);
