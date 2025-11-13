import { vol } from 'memfs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { copyTemplateDirectory, ensureTargetDirectoryAvailable } from '@/modules/fs/filesystem';

// memfs를 사용하여 파일 시스템 모킹
vi.mock('node:fs/promises', async () => {
  const memfs = await import('memfs');
  return memfs.fs.promises;
});

vi.mock('node:fs', async () => {
  const memfs = await import('memfs');
  return memfs.fs;
});

describe('ensureTargetDirectoryAvailable', () => {
  beforeEach(() => {
    vol.reset();
  });

  it('디렉터리가 존재하지 않으면 성공해야 합니다', async () => {
    await expect(ensureTargetDirectoryAvailable('/nonexistent')).resolves.not.toThrow();
  });

  it('디렉터리가 이미 존재하면 에러를 발생시켜야 합니다', async () => {
    vol.mkdirSync('/existing', { recursive: true });

    await expect(ensureTargetDirectoryAvailable('/existing')).rejects.toThrow(
      'Target path already exists: /existing',
    );
  });

  it('파일이 존재하면 에러를 발생시켜야 합니다', async () => {
    vol.writeFileSync('/existing-file', 'content');

    await expect(ensureTargetDirectoryAvailable('/existing-file')).rejects.toThrow(
      'Target path already exists: /existing-file',
    );
  });
});

describe('copyTemplateDirectory', () => {
  beforeEach(() => {
    vol.reset();
  });

  it('템플릿 디렉터리를 대상 디렉터리로 복사해야 합니다', async () => {
    // 소스 템플릿 디렉터리 생성
    vol.mkdirSync('/source', { recursive: true });
    vol.writeFileSync('/source/file1.txt', 'content1');
    vol.writeFileSync('/source/file2.txt', 'content2');
    vol.mkdirSync('/source/subdir', { recursive: true });
    vol.writeFileSync('/source/subdir/file3.txt', 'content3');

    await copyTemplateDirectory('/source', '/target');

    // 복사된 파일들이 존재하는지 확인
    expect(vol.existsSync('/target/file1.txt')).toBe(true);
    expect(vol.existsSync('/target/file2.txt')).toBe(true);
    expect(vol.existsSync('/target/subdir/file3.txt')).toBe(true);

    // 파일 내용이 일치하는지 확인
    expect(vol.readFileSync('/target/file1.txt', 'utf-8')).toBe('content1');
    expect(vol.readFileSync('/target/file2.txt', 'utf-8')).toBe('content2');
    expect(vol.readFileSync('/target/subdir/file3.txt', 'utf-8')).toBe('content3');
  });

  it('빈 디렉터리도 복사해야 합니다', async () => {
    vol.mkdirSync('/source', { recursive: true });

    await copyTemplateDirectory('/source', '/target');

    expect(vol.existsSync('/target')).toBe(true);
  });
});

