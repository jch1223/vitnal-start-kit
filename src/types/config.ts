import type { ProjectOptions } from './options';

export interface ResolvedConfig {
  projectName: string;
  options: ProjectOptions;
  // TODO: 템플릿 선택 기능 도입 시 templateKey 등 추가 필드 확장을 검토합니다.
}
