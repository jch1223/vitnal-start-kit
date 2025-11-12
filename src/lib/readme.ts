import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { render } from 'ejs';

import type { ProjectOptions } from '../types/options';

interface ReadmeData {
  projectName: string;
  options: ProjectOptions;
}

/**
 * README 템플릿 파일을 읽어서 옵션 데이터를 주입하여 README.md 파일을 생성합니다.
 */
export const generateReadme = async (
  targetDir: string,
  projectName: string,
  options: ProjectOptions,
): Promise<void> => {
  const templatePath = path.resolve(__dirname, '..', '..', 'templates', 'README.template.md');
  const outputPath = path.join(targetDir, 'README.md');

  // 템플릿 파일 읽기
  const template = await readFile(templatePath, 'utf-8');

  // EJS로 렌더링
  const data: ReadmeData = {
    projectName,
    options,
  };

  const rendered = render(template, data);

  // README.md 파일로 저장
  await writeFile(outputPath, rendered, 'utf-8');
};
