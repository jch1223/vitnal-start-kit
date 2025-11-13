import type { ProjectOptions } from '@/types/options';

export interface DependencyBuckets {
  dependencies: string[];
  devDependencies: string[];
}

/**
 * 사용자 선택 옵션을 기반으로 추가 설치가 필요한 패키지 목록을 계산합니다.
 */
export const resolveOptionalPackages = (options: ProjectOptions): DependencyBuckets => {
  const dependencySet = new Set<string>();
  const devDependencySet = new Set<string>();

  if (options.reactQuery) {
    dependencySet.add('@tanstack/react-query');
  }

  if (options.taskmaster) {
    devDependencySet.add('task-master-ai');
  }

  if (options.stateManagement === 'jotai') {
    dependencySet.add('jotai');
  } else if (options.stateManagement === 'zustand') {
    dependencySet.add('zustand');
  }

  return {
    dependencies: Array.from(dependencySet).sort(),
    devDependencies: Array.from(devDependencySet).sort(),
  };
};

