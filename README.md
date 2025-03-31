# OceanEEDA Frontend Docker Compose

## 사용 방법

1. Docker와 Docker Compose가 설치되어 있어야 합니다.

2. 이 저장소를 클론합니다:
```bash
git clone [your-github-repo-url]
cd [repo-name]
```

3. 환경 변수 설정:
   - docker-compose.yml 파일에서 직접 환경 변수를 수정하거나
   - .env.local 파일을 생성하여 환경 변수를 설정합니다

4. 애플리케이션 실행:
```bash
docker-compose up
```

5. 애플리케이션 중지:
```bash
docker-compose down
```

## 환경 변수 설정

### 방법 1: docker-compose.yml 직접 수정
```yaml
environment:
  - NEXT_PUBLIC_GRAPHQL_URI=http://your-graphql-url:9090/
```

### 방법 2: .env.local 파일 사용
1. .env.local 파일 생성:
```
NEXT_PUBLIC_GRAPHQL_URI=http://your-graphql-url:9090/
```

2. docker-compose.yml에서 주석 해제:
```yaml
env_file:
  - .env.local
```

## 포트
- 기본 포트: 3000
- 포트 변경이 필요한 경우 docker-compose.yml의 ports 섹션을 수정하세요

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# OceanEEDA-FRONT
