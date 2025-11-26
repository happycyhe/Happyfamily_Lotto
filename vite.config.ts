import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 현재 환경 변수 로드 (Replit Secrets 포함)
  // Fix: Cast process to any because the Process type definition might be missing 'cwd' in this environment
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // 코드 내의 process.env.API_KEY를 실제 빌드/실행 타임 환경 변수 값으로 치환
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
    server: {
      host: '0.0.0.0', // Replit 외부 접속 허용을 위해 필수
      port: 5173,
    }
  };
});