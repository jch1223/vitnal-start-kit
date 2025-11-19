import ora from 'ora';

import { resolveOptionalPackages } from '@/modules/install/dependencies.js';
import { runCommand } from '@/modules/install/process.js';
import type { ProjectOptions } from '@/types/options.js';

/**
 * 사용자 선택 옵션에 따라 추가 패키지를 설치합니다.
 * 설치 과정은 ora 스피너로 시각적 피드백을 제공합니다.
 */
export const installOptionalDependencies = async (
  targetDir: string,
  options: ProjectOptions,
): Promise<void> => {
  const { dependencies, devDependencies } = resolveOptionalPackages(options);

  if (dependencies.length > 0) {
    const spinner = ora(`선택 옵션에 따른 패키지를 설치합니다: ${dependencies.join(', ')}`).start();
    try {
      await runCommand('npm', ['install', ...dependencies], { cwd: targetDir });
      spinner.succeed(`패키지 설치 완료: ${dependencies.join(', ')}`);
    } catch (error) {
      spinner.fail(`패키지 설치 실패: ${dependencies.join(', ')}`);
      throw error;
    }
  }

  if (devDependencies.length > 0) {
    const spinner = ora(
      `선택 옵션에 따른 개발 의존성을 설치합니다: ${devDependencies.join(', ')}`,
    ).start();
    try {
      await runCommand('npm', ['install', '--save-dev', ...devDependencies], { cwd: targetDir });
      spinner.succeed(`개발 의존성 설치 완료: ${devDependencies.join(', ')}`);
    } catch (error) {
      spinner.fail(`개발 의존성 설치 실패: ${devDependencies.join(', ')}`);
      throw error;
    }
  }
};
