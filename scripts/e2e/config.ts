#!/usr/bin/env bun

import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Bun 1.0.23+에서는 import.meta.dir을 지원하지만, 안정성을 위해 fileURLToPath도 함께 사용
// import.meta.dir이 undefined일 경우를 대비한 fallback
const __filename = fileURLToPath(import.meta.url);
const __dirname = (import.meta.dir as string | undefined) || path.dirname(__filename);

export const PROJECT_ROOT = path.resolve(__dirname, '../..');
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
