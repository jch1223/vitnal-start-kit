import path from 'node:path';

import type { ResolvedConfig } from '@/types/config';

const TEMPLATE_BASE_DIR = path.resolve(__dirname, '..', '..', '..', 'templates', 'base');

export interface ScaffoldPaths {
  templateDir: string;
  targetDir: string;
}

/**
 * 스캐폴딩에 필요한 템플릿/타깃 디렉터리 경로를 계산합니다.
 */
export const resolveScaffoldPaths = (config: ResolvedConfig): ScaffoldPaths => {
  const targetDir = path.resolve(process.cwd(), config.projectName);

  return {
    templateDir: TEMPLATE_BASE_DIR,
    targetDir,
  };
};
