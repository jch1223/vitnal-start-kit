import { spawn } from 'node:child_process';

interface RunCommandOptions {
  cwd: string;
}

/**
 * Spawn 기반으로 명령어를 실행하고 완료될 때까지 대기합니다.
 * 표준 출력과 에러는 현재 프로세스와 공유합니다.
 */
export const runCommand = (
  command: string,
  args: string[],
  options: RunCommandOptions,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
      // 환경 변수 전달 (E2E 테스트 환경 감지용)
      env: { ...process.env },
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(
        new Error(
          `명령어 '${command} ${args.join(' ')}' 실행이 실패했습니다. (exit code: ${code})`,
        ),
      );
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
};
