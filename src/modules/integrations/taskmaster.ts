import ora from 'ora';

import { runCommand } from '@/modules/install';

/**
 * Taskmaster를 초기화합니다.
 * 패키지는 이미 installOptionalDependencies에서 설치되었으므로,
 * 로컬에 설치된 task-master CLI를 사용하여 초기화를 실행합니다.
 *
 * E2E 테스트 환경에서는 자동으로 --yes 플래그를 사용하여 비대화형 모드로 실행합니다.
 * 일반 사용자는 대화형 프롬프트를 통해 세부 설정을 선택할 수 있습니다.
 *
 * 대화형 모드에서는 스피너를 중지하여 taskmaster의 프롬프트가 보이도록 합니다.
 */
export const installAndInitializeTaskmaster = async (targetDir: string): Promise<void> => {
  // E2E 테스트 환경 감지 (CI 환경 또는 환경 변수로 확인)
  const isNonInteractive =
    process.env.CI === 'true' ||
    process.env.NODE_ENV === 'test' ||
    process.env.VITEST === 'true' ||
    process.env.E2E_TEST === 'true';

  const initArgs = isNonInteractive
    ? ['task-master', 'init', '--yes'] // E2E 테스트: 비대화형 모드
    : ['task-master', 'init']; // 일반 사용자: 대화형 프롬프트

  // 비대화형 모드일 때만 스피너 사용 (대화형 모드에서는 프롬프트가 보여야 함)
  const spinner = isNonInteractive ? ora('Taskmaster 초기 설정을 진행합니다...').start() : null;

  try {
    // npx는 로컬에 설치된 패키지를 우선 사용하므로, 설치 후 바로 실행 가능
    await runCommand('npx', initArgs, { cwd: targetDir });

    if (spinner) {
      spinner.succeed('Taskmaster 초기화가 완료되었습니다.');
    } else {
      // 대화형 모드에서는 사용자가 이미 프롬프트를 통해 설정했으므로
      // 추가 메시지 없이 완료 (taskmaster가 자체적으로 완료 메시지를 표시함)
      console.log('\n✅ Taskmaster 초기화가 완료되었습니다.');
    }
  } catch (error) {
    if (spinner) {
      spinner.fail('Taskmaster 초기화에 실패했습니다.');
    }
    throw error;
  }
};

