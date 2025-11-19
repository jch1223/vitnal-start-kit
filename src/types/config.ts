import type { ProjectOptions } from '@/types/options.js';

export interface ResolvedConfig {
  projectName: string;
  options: ProjectOptions;
  // TODO: 템플릿 선택 기능 도입 시 templateKey 등 추가 필드 확장을 검토합니다.
  // TODO: 추후 README 커스터마이징 시 description, repository 등 메타데이터를 받을 수 있도록 고려합니다.
}
