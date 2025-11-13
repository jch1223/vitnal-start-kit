import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ESM 모듈에서 __dirname을 얻기 위한 방법
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 컴파일된 파일이 scripts/e2e/dist에 있으므로, 루트로 가려면 ../../..로 이동
export const PROJECT_ROOT = path.resolve(__dirname, '../../..');
export const TEST_PROJECT_NAME = 'vitnal-e2e-test';
export const TEST_PROJECT_DIR = path.join(PROJECT_ROOT, TEST_PROJECT_NAME);

/**
 * 필수 파일 및 디렉터리 목록
 */
export const REQUIRED_FILES: string[] = [
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'src',
  'src/main.tsx',
  'src/App.tsx',
  'index.html',
];
