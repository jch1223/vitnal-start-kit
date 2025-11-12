import { copyTemplateDirectory, ensureTargetDirectoryAvailable } from './filesystem';
import { installOptionalDependencies } from './installer';
import { updatePackageJsonMetadata } from './package-metadata';
import { resolveScaffoldPaths } from './paths';
import { installAndInitializeTaskmaster } from './taskmaster';

import type { ResolvedConfig } from '../types/config';

/**
 * `create-vitnal` 프로젝트 스캐폴딩 흐름을 총괄하는 함수입니다.
 * 실제 구현을 구축하기 전까지는 플레이스홀더 메시지를 출력합니다.
 */
export const createProject = async (config: ResolvedConfig): Promise<void> => {
  const paths = resolveScaffoldPaths(config);

  console.log(`타깃 디렉터리: ${paths.targetDir}`);
  console.log('선택된 옵션:', config.options);

  await ensureTargetDirectoryAvailable(paths.targetDir);
  await copyTemplateDirectory(paths.templateDir, paths.targetDir);
  console.log('기본 템플릿 복사가 완료되었습니다.');
  await updatePackageJsonMetadata(config, paths.targetDir);
  console.log('패키지 메타데이터가 업데이트되었습니다.');

  await installOptionalDependencies(paths.targetDir, config.options);

  if (config.options.taskmaster) {
    await installAndInitializeTaskmaster(paths.targetDir);
    console.log('Taskmaster 초기화가 완료되었습니다.');
  }

  // TODO: 선택한 옵션(Tailwind 외 추가 패키지 등)을 템플릿 파일에 반영합니다.
  // TODO: 새 프로젝트 디렉터리에서 npm으로 의존성을 설치합니다.
  // TODO: 옵션별 스크립트를 실행한 뒤 README 요약을 생성합니다.
};
