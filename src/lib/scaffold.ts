import { resolveScaffoldPaths } from './paths';

import type { ResolvedConfig } from '../types/config';

/**
 * `create-vitnal` 프로젝트 스캐폴딩 흐름을 총괄하는 함수입니다.
 * 실제 구현을 구축하기 전까지는 플레이스홀더 메시지를 출력합니다.
 */
export const createProject = async (config: ResolvedConfig): Promise<void> => {
  const paths = resolveScaffoldPaths(config);

  console.log(`Project directory '${config.projectName}' will be created.`);
  console.log('Selected options:', config.options);
  console.log('Resolved paths:', paths);

  // TODO: 기본 템플릿을 대상 디렉터리에 복사합니다.
  // TODO: 선택한 옵션(Tailwind, Taskmaster 등)을 템플릿 파일에 반영합니다.
  // TODO: 새 프로젝트 디렉터리에서 npm으로 의존성을 설치합니다.
  // TODO: 설정 요약과 안내를 담은 README.md를 생성합니다.
};
