import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { ResolvedConfig } from '../types/config';

interface PackageJson {
  name?: string;
  [key: string]: unknown;
}

/**
 * 템플릿에서 복사한 package.json의 name 필드를 프로젝트 이름으로 갱신합니다.
 */
export const updatePackageJsonMetadata = async (
  config: ResolvedConfig,
  projectRoot: string,
): Promise<void> => {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const content = await readFile(packageJsonPath, 'utf8');
  const parsed = JSON.parse(content) as PackageJson;

  const updated: PackageJson = {
    ...parsed,
    name: config.projectName,
  };

  await writeFile(packageJsonPath, `${JSON.stringify(updated, null, 2)}\n`, 'utf8');
};
