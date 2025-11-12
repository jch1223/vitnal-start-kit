import { resolveOptionalPackages } from './dependencies';
import { runCommand } from './process';

import type { ProjectOptions } from '../types/options';

/**
 * 사용자 선택 옵션에 따라 추가 패키지를 설치합니다.
 */
export const installOptionalDependencies = async (
  targetDir: string,
  options: ProjectOptions,
): Promise<void> => {
  const { dependencies, devDependencies } = resolveOptionalPackages(options);

  if (dependencies.length > 0) {
    console.log(`선택 옵션에 따른 패키지를 설치합니다: ${dependencies.join(', ')}`);
    await runCommand('npm', ['install', ...dependencies], { cwd: targetDir });
  }

  if (devDependencies.length > 0) {
    console.log(`선택 옵션에 따른 개발 의존성을 설치합니다: ${devDependencies.join(', ')}`);
    await runCommand('npm', ['install', '--save-dev', ...devDependencies], { cwd: targetDir });
  }
};
