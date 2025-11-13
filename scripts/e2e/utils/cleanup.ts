#!/usr/bin/env bun

import { TEST_PROJECT_DIR } from '@e2e/config';

/**
 * 임시 프로젝트 디렉터리를 정리합니다.
 */
export const cleanup = async (): Promise<void> => {
  try {
    // Bun의 Promise 기반 fs API 사용 (node:fs/promises)
    const { rm, access } = await import('node:fs/promises');
    try {
      await access(TEST_PROJECT_DIR);
      await rm(TEST_PROJECT_DIR, { recursive: true, force: true });
      console.log(`✓ 임시 프로젝트 디렉터리 삭제 완료: ${TEST_PROJECT_DIR}`);
    } catch {
      // 디렉터리가 없으면 무시
    }
  } catch (error) {
    // 디렉터리가 없거나 삭제 실패 시 무시
  }
};
