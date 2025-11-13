#!/usr/bin/env node

import { Command } from 'commander';

import packageJson from '../package.json';
import { normalizeProjectName } from './lib/normalize-project-name';
import { promptForOptions } from './lib/prompts';
import { createProject } from './lib/scaffold';

import type { ResolvedConfig } from './types/config';

const executeCreateCommand = async (projectName: string): Promise<void> => {
  const normalizedName = normalizeProjectName(projectName);
  const options = await promptForOptions();

  const config: ResolvedConfig = {
    projectName: normalizedName,
    options,
  };

  await createProject(config);
};

const program = new Command();

program
  .name('create-vitnal-start-kit')
  .description('Bootstrap a Vitnal React + TypeScript project with curated defaults.')
  .version(packageJson.version ?? '0.0.0')
  .argument('[project-name]', 'The name of the project directory to create')
  .action(async (projectName?: string) => {
    // npm create로 실행될 때 프로젝트 이름이 인자로 전달됨
    const targetProjectName = projectName ?? process.argv[2];

    if (!targetProjectName) {
      console.error('Error: Project name is required');
      console.error('');
      console.error('Usage:');
      console.error('  npm create vitnal-start-kit@latest <project-name>');
      console.error('  npx create-vitnal-start-kit <project-name>');
      process.exit(1);
    }

    try {
      await executeCreateCommand(targetProjectName);
    } catch (error) {
      console.error('Failed to create project:', error);
      process.exit(1);
    }
  });

program.parseAsync(process.argv).catch((error) => {
  console.error(error);
  process.exit(1);
});
