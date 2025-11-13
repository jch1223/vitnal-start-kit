import path from 'node:path';

// CommonJS 모듈에서는 __dirname이 자동으로 제공됨
// TypeScript 컴파일러가 CommonJS로 컴파일하면 __dirname이 자동으로 생성됨
// 컴파일된 파일 위치: scripts/e2e/dist/config.js
// 프로젝트 루트: scripts/e2e/dist -> scripts/e2e -> scripts -> 프로젝트 루트 (../../..)
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
