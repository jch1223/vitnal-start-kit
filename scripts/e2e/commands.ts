import { TEST_PROJECT_DIR } from '@e2e/config';

/**
 * 생성된 프로젝트에서 npm 명령어를 실행합니다.
 */
export const runNpmCommands = async (): Promise<void> => {
  console.log('📦 npm install 실행 중...');
  const installProcess = Bun.spawn(['npm', 'install'], {
    cwd: TEST_PROJECT_DIR,
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const installExitCode = await installProcess.exited;
  if (installExitCode !== 0) {
    throw new Error('npm install 실패');
  }
  console.log('✓ npm install 완료\n');

  // Playwright 브라우저 설치 (Storybook 테스트에 필요)
  console.log('🌐 Playwright 브라우저 설치 중...');
  const playwrightProcess = Bun.spawn(['npx', 'playwright', 'install', 'chromium'], {
    cwd: TEST_PROJECT_DIR,
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const playwrightExitCode = await playwrightProcess.exited;
  if (playwrightExitCode !== 0) {
    throw new Error('Playwright 브라우저 설치 실패');
  }
  console.log('✓ Playwright 브라우저 설치 완료\n');

  console.log('🔨 npm run build 실행 중...');
  const buildProcess = Bun.spawn(['npm', 'run', 'build'], {
    cwd: TEST_PROJECT_DIR,
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const buildExitCode = await buildProcess.exited;
  if (buildExitCode !== 0) {
    throw new Error('npm run build 실패');
  }
  console.log('✓ npm run build 완료\n');

  // 기본 프로젝트만 실행 (Storybook 프로젝트는 CI에서 별도로 실행)
  console.log('🧪 npm run test 실행 중... (기본 프로젝트만)');
  const testProcess = Bun.spawn(['npm', 'run', 'test', '--', '--project=default'], {
    cwd: TEST_PROJECT_DIR,
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const testExitCode = await testProcess.exited;
  if (testExitCode !== 0) {
    throw new Error('npm run test 실패');
  }
  console.log('✓ npm run test 완료\n');
};
