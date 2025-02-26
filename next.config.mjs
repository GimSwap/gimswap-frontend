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
  unoptimized: true, // Next.js가 이미지를 변환하지 않고 원본 유지하도록 설정
  reactStrictMode: false,
};

export default withNextIntl(nextConfig);
