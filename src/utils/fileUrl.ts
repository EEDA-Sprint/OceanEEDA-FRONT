// 업로드 파일은 백엔드 기준 상대경로, 외부 이미지(더미 데이터 등)는 절대 URL
export const fileUrl = (path: string) =>
  /^https?:\/\//.test(path) ? path : `${process.env.NEXT_PUBLIC_GRAPHQL_URI}${path}`;
