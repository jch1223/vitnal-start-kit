import { describe, expect, it } from 'vitest';

import { resolveOptionalPackages } from '@/modules/install/dependencies';
import type { ProjectOptions } from '@/types/options';

describe('resolveOptionalPackages', () => {
  it('옵션이 없으면 빈 배열을 반환해야 합니다', () => {
    const options: ProjectOptions = {
      reactQuery: false,
      stateManagement: 'none',
      taskmaster: false,
    };

    const result = resolveOptionalPackages(options);

    expect(result.dependencies).toEqual([]);
    expect(result.devDependencies).toEqual([]);
  });

  it('React Query 옵션이 활성화되면 @tanstack/react-query를 추가해야 합니다', () => {
    const options: ProjectOptions = {
      reactQuery: true,
      stateManagement: 'none',
      taskmaster: false,
    };

    const result = resolveOptionalPackages(options);

    expect(result.dependencies).toContain('@tanstack/react-query');
    expect(result.devDependencies).toEqual([]);
  });

  it('Jotai 옵션이 선택되면 jotai를 추가해야 합니다', () => {
    const options: ProjectOptions = {
      reactQuery: false,
      stateManagement: 'jotai',
      taskmaster: false,
    };

    const result = resolveOptionalPackages(options);

    expect(result.dependencies).toContain('jotai');
    expect(result.devDependencies).toEqual([]);
  });

  it('Zustand 옵션이 선택되면 zustand를 추가해야 합니다', () => {
    const options: ProjectOptions = {
      reactQuery: false,
      stateManagement: 'zustand',
      taskmaster: false,
    };

    const result = resolveOptionalPackages(options);

    expect(result.dependencies).toContain('zustand');
    expect(result.devDependencies).toEqual([]);
  });

  it('Taskmaster 옵션이 활성화되면 task-master-ai를 devDependencies에 추가해야 합니다', () => {
    const options: ProjectOptions = {
      reactQuery: false,
      stateManagement: 'none',
      taskmaster: true,
    };

    const result = resolveOptionalPackages(options);

    expect(result.dependencies).toEqual([]);
    expect(result.devDependencies).toContain('task-master-ai');
  });

  it('여러 옵션이 활성화되면 모든 패키지를 포함해야 합니다', () => {
    const options: ProjectOptions = {
      reactQuery: true,
      stateManagement: 'jotai',
      taskmaster: true,
    };

    const result = resolveOptionalPackages(options);

    expect(result.dependencies).toContain('@tanstack/react-query');
    expect(result.dependencies).toContain('jotai');
    expect(result.devDependencies).toContain('task-master-ai');
  });

  it('의존성 목록이 정렬되어 있어야 합니다', () => {
    const options: ProjectOptions = {
      reactQuery: true,
      stateManagement: 'zustand',
      taskmaster: false,
    };

    const result = resolveOptionalPackages(options);

    expect(result.dependencies).toEqual(['@tanstack/react-query', 'zustand']);
  });
});
