import { cp, stat } from 'node:fs/promises';

/**
 * 대상 경로가 이미 존재하지 않는지 확인합니다.
 * 디렉터리가 존재한다면 에러를 발생시켜 스캐폴딩을 중단합니다.
 */
export const ensureTargetDirectoryAvailable = async (targetPath: string): Promise<void> => {
  try {
    await stat(targetPath);
    throw new Error(`Target path already exists: ${targetPath}`);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === 'ENOENT') {
      // 존재하지 않으면 스캐폴딩을 계속 진행합니다.
      return;
    }

    throw error;
  }
};

/**
 * 템플릿 디렉터리 전체를 대상 경로로 복사합니다.
 */
export const copyTemplateDirectory = async (
  sourceDir: string,
  targetDir: string,
): Promise<void> => {
  await cp(sourceDir, targetDir, { recursive: true });
};

