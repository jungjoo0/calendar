import { defineConfig } from 'vite';

export default defineConfig({
  // 빌드 결과물이 GitHub Pages 등의 서브디렉토리 주소에서도 정상 작동하도록 빌드 기준 경로를 상대경로로 설정합니다.
  base: './',
});
