#!/usr/bin/env node

import { execa } from 'execa';
import { PROJECT_ROOT } from '@e2e/config';
import { runNpmCommands } from '@e2e/commands';
import { runCreateCommand } from '@e2e/prompts';
import { cleanup } from '@e2e/utils/cleanup';
import { validateProjectStructure } from '@e2e/utils/validation';

/**
 * E2E 테스트를 실행합니다.
 */
const runE2ETest = async () => {
  console.log('🚀 E2E 테스트 시작...\n');
  process.env.E2E_TEST = 'true';

  try {
    await cleanup();

    console.log('📦 CLI 빌드 확인 중...');
    const buildResult = await execa('npm', ['run', 'build'], {
      cwd: PROJECT_ROOT,
      stdout: 'inherit',
      stderr: 'inherit',
    });

    if (buildResult.exitCode !== 0) {
      throw new Error('CLI 빌드 실패');
    }
    console.log('✓ CLI 빌드 완료\n');

    await runCreateCommand();
    await validateProjectStructure();
    await runNpmCommands();

    console.log('✅ 모든 E2E 테스트 통과!');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ E2E 테스트 실패:', errorMessage);
    throw error;
  } finally {
    await cleanup();
  }
};

runE2ETest().catch((error) => {
  console.error('E2E 테스트 실행 중 오류 발생:', error);
  process.exit(1);
});
