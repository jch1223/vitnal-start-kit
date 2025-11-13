import { spawn } from 'node:child_process';
import { TEST_PROJECT_DIR } from '@e2e/config';

/**
 * 생성된 프로젝트에서 npm 명령어를 실행합니다.
 */
const runCommand = async (command: string, args: string[], description: string): Promise<void> => {
  console.log(`${description} 실행 중...`);
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      cwd: TEST_PROJECT_DIR,
      stdio: 'inherit',
      shell: true,
    });

    process.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${description} 실패`));
      } else {
        console.log(`✓ ${description} 완료\n`);
        resolve();
      }
    });

    process.on('error', (error) => {
      reject(new Error(`${description} 실행 중 오류: ${error.message}`));
    });
  });
};

export const runNpmCommands = async (): Promise<void> => {
  await runCommand('npm', ['install'], '📦 npm install');
  await runCommand('npm', ['run', 'build'], '🔨 npm run build');

  // 기본 프로젝트만 실행 (Storybook 프로젝트는 CI에서 별도로 실행)
  await runCommand(
    'npm',
    ['run', 'test', '--', '--project=default'],
    '🧪 npm run test (기본 프로젝트만)',
  );
};
