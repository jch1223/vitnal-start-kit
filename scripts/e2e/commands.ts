import { execa } from 'execa';
import { TEST_PROJECT_DIR } from '@e2e/config';

/**
 * 생성된 프로젝트에서 npm 명령어를 실행합니다.
 */
export const runNpmCommands = async (): Promise<void> => {
  console.log('📦 npm install 실행 중...');
  const installResult = await execa('npm', ['install'], {
    cwd: TEST_PROJECT_DIR,
    stdout: 'inherit',
    stderr: 'inherit',
  });

  if (installResult.exitCode !== 0) {
    throw new Error('npm install 실패');
  }
  console.log('✓ npm install 완료\n');

  console.log('🔨 npm run build 실행 중...');
  const buildResult = await execa('npm', ['run', 'build'], {
    cwd: TEST_PROJECT_DIR,
    stdout: 'inherit',
    stderr: 'inherit',
  });

  if (buildResult.exitCode !== 0) {
    throw new Error('npm run build 실패');
  }
  console.log('✓ npm run build 완료\n');

  console.log('🧪 npm run test 실행 중... (기본 프로젝트만)');
  const testResult = await execa('npm', ['run', 'test', '--', '--project=default'], {
    cwd: TEST_PROJECT_DIR,
    stdout: 'inherit',
    stderr: 'inherit',
  });

  if (testResult.exitCode !== 0) {
    throw new Error('npm run test 실패');
  }
  console.log('✓ npm run test 완료\n');
};
