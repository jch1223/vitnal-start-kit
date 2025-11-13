import path from 'node:path';

import { REQUIRED_FILES, TEST_PROJECT_DIR } from '@e2e/config';

/**
 * 생성된 프로젝트의 파일 구조를 검증합니다.
 */
export const validateProjectStructure = async (): Promise<void> => {
  console.log('📋 생성된 프로젝트 파일 구조 검증 중...');

  const { stat } = await import('node:fs/promises');
  const missingFiles: string[] = [];

  for (const file of REQUIRED_FILES) {
    const filePath = path.join(TEST_PROJECT_DIR, file);

    try {
      const stats = await stat(filePath);

      // src는 디렉터리여야 하고, 나머지는 파일이어야 함
      if (file === 'src' && !stats.isDirectory()) {
        missingFiles.push(file);
      } else if (file !== 'src' && stats.isDirectory()) {
        missingFiles.push(file);
      }
    } catch (error) {
      // 파일/디렉터리가 존재하지 않으면 에러 발생
      missingFiles.push(file);
    }
  }

  if (missingFiles.length > 0) {
    throw new Error(`필수 파일이 누락되었습니다: ${missingFiles.join(', ')}`);
  }

  console.log('✓ 파일 구조 검증 완료\n');
};
