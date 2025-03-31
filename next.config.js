/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Strict Mode 활성화
  reactStrictMode: true,

  // Image Optimization 설정
  images: {
    domains: ["example.com", "another-domain.com", "localhost"], // 외부 이미지 도메인 허용
    formats: ["image/webp"], // 지원할 이미지 포맷
  },

  // Babel 대신 Next.js 내장 styled-components 지원 활성화
  compiler: {
    styledComponents: true, // styled-components 사용 시 필수
  },

  // API 경로 재작성
  async rewrites() {
    return [
      {
        source: "/api/:path*", // 클라이언트가 요청할 URL
        destination: "https://api.example.com/:path*", // 실제 API 경로
      },
    ];
  },

  // URL 리다이렉션
  async redirects() {
    return [
      {
        source: "/old-route", // 사용자가 접근하는 URL
        destination: "/new-route", // 리다이렉트될 URL
        permanent: true, // 301 상태코드 사용
      },
    ];
  },

  output: 'standalone',
};

module.exports = nextConfig;
