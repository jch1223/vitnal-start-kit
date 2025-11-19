import { describe, expect, it } from 'vitest';

import { normalizeProjectName } from '@/modules/utils/normalize-project-name.js';

describe('normalizeProjectName', () => {
  it('정상적인 프로젝트 이름을 반환해야 합니다', () => {
    expect(normalizeProjectName('my-app')).toBe('my-app');
    expect(normalizeProjectName('my-app-123')).toBe('my-app-123');
  });

  it('앞뒤 공백을 제거해야 합니다', () => {
    expect(normalizeProjectName('  my-app  ')).toBe('my-app');
    expect(normalizeProjectName('\tmy-app\n')).toBe('my-app');
  });

  it('빈 문자열이면 에러를 발생시켜야 합니다', () => {
    expect(() => normalizeProjectName('')).toThrow('Project name must not be empty.');
    expect(() => normalizeProjectName('   ')).toThrow('Project name must not be empty.');
    expect(() => normalizeProjectName('\t\n')).toThrow('Project name must not be empty.');
  });
});
