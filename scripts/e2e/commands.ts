import { TEST_PROJECT_DIR } from '@e2e/config';

/**
 * 생성된 프로젝트에서 bun 명령어를 실행합니다.
 * Bun의 빠른 패키지 설치와 빌드 속도를 활용합니다.
 */
export const runNpmCommands = async (): Promise<void> => {
  console.log('📦 bun install 실행 중...');
  const installProcess = Bun.spawn(['bun', 'install'], {
    cwd: TEST_PROJECT_DIR,
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const installExitCode = await installProcess.exited;
  if (installExitCode !== 0) {
    throw new Error('bun install 실패');
  }
  console.log('✓ bun install 완료\n');

  console.log('🔨 bun run build 실행 중...');
  const buildProcess = Bun.spawn(['bun', 'run', 'build'], {
    cwd: TEST_PROJECT_DIR,
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const buildExitCode = await buildProcess.exited;
  if (buildExitCode !== 0) {
    throw new Error('bun run build 실패');
  }
  console.log('✓ bun run build 완료\n');

  // 기본 프로젝트만 실행 (Storybook 프로젝트는 CI에서 별도로 실행)
  console.log('🧪 bun run test 실행 중... (기본 프로젝트만)');
  const testProcess = Bun.spawn(['bun', 'run', 'test', '--', '--project=default'], {
    cwd: TEST_PROJECT_DIR,
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const testExitCode = await testProcess.exited;
  if (testExitCode !== 0) {
    throw new Error('bun run test 실패');
  }
  console.log('✓ bun run test 완료\n');
};
