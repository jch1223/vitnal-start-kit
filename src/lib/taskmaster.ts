import ora from 'ora';

import { runCommand } from './process';

/**
 * Taskmaster를 초기화합니다.
 * 패키지는 이미 installOptionalDependencies에서 설치되었으므로,
 * 로컬에 설치된 task-master CLI를 사용하여 초기화를 실행합니다.
 * 초기화 과정은 ora 스피너로 시각적 피드백을 제공합니다.
 */
export const installAndInitializeTaskmaster = async (targetDir: string): Promise<void> => {
  const spinner = ora('Taskmaster 초기 설정을 진행합니다...').start();
  try {
    // npx는 로컬에 설치된 패키지를 우선 사용하므로, 설치 후 바로 실행 가능
    await runCommand('npx', ['task-master', 'init', '--yes'], { cwd: targetDir });
    spinner.succeed('Taskmaster 초기화가 완료되었습니다.');
  } catch (error) {
    spinner.fail('Taskmaster 초기화에 실패했습니다.');
    throw error;
  }
};
