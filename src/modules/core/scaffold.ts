import ora from 'ora';

import { copyTemplateDirectory, ensureTargetDirectoryAvailable } from '@/modules/fs/index.js';
import { updatePackageJsonMetadata, generateReadme } from '@/modules/generators/index.js';
import { installOptionalDependencies } from '@/modules/install/index.js';
import { installAndInitializeTaskmaster } from '@/modules/integrations/index.js';
import { resolveScaffoldPaths } from '@/modules/utils/index.js';
import type { ResolvedConfig } from '@/types/config.js';

/**
 * `create-vitnal` 프로젝트 스캐폴딩 흐름을 총괄하는 함수입니다.
 * 실제 구현을 구축하기 전까지는 플레이스홀더 메시지를 출력합니다.
 */
export const createProject = async (config: ResolvedConfig): Promise<void> => {
  const paths = resolveScaffoldPaths(config);

  console.log(`타깃 디렉터리: ${paths.targetDir}`);
  console.log('선택된 옵션:', config.options);

  await ensureTargetDirectoryAvailable(paths.targetDir);

  const copySpinner = ora('템플릿 파일을 복사하는 중...').start();
  try {
    await copyTemplateDirectory(paths.templateDir, paths.targetDir);
    copySpinner.succeed('템플릿 복사가 완료되었습니다.');
  } catch (error) {
    copySpinner.fail('템플릿 복사에 실패했습니다.');
    throw error;
  }

  const metadataSpinner = ora('패키지 메타데이터를 업데이트하는 중...').start();
  try {
    await updatePackageJsonMetadata(config, paths.targetDir);
    metadataSpinner.succeed('패키지 메타데이터 업데이트 완료');
  } catch (error) {
    metadataSpinner.fail('패키지 메타데이터 업데이트 실패');
    throw error;
  }

  // README.md 동적 생성 (템플릿의 README.md를 덮어씀)
  const readmeSpinner = ora('README.md 파일을 생성하는 중...').start();
  try {
    await generateReadme(paths.targetDir, config.projectName, config.options);
    readmeSpinner.succeed('README.md 파일 생성 완료');
  } catch (error) {
    readmeSpinner.fail('README.md 파일 생성 실패');
    throw error;
  }

  await installOptionalDependencies(paths.targetDir, config.options);

  if (config.options.taskmaster) {
    await installAndInitializeTaskmaster(paths.targetDir);
  }

  // TODO: 선택한 옵션(Tailwind 외 추가 패키지 등)을 템플릿 파일에 반영합니다.
  // TODO: 새 프로젝트 디렉터리에서 npm으로 의존성을 설치합니다.
  // TODO: 옵션별 스크립트를 실행한 뒤 README 요약을 생성합니다.
};
