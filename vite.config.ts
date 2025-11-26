import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 현재 환경 변수 로드 (Replit Secrets 포함)
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // 코드 내의 process.env.API_KEY를 실제 빌드/실행 타임 환경 변수 값으로 치환
      'baf5295fe469429159bc88e016c7ee94b8998e55': JSON.stringify(env.API_KEY),
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      // Replit의 동적 도메인 접속 허용 (보안 검사 비활성화)
      allowedHosts: true,
    },
    preview: {
      host: '0.0.0.0',
      port: 5173,
      allowedHosts: true,
    }
  };
});