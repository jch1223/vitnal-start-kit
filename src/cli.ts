#!/usr/bin/env node

import { Command } from 'commander';

import { createProject } from '@/modules/core/index.js';
import { promptForOptions } from '@/modules/prompts/index.js';
import { normalizeProjectName } from '@/modules/utils/index.js';
import type { ResolvedConfig } from '@/types/config.js';

import packageJson from '../package.json' with { type: 'json' };

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
  .name('create-vsk')
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
      console.error('  npm create vsk@latest <project-name>');
      console.error('  npx create-vsk <project-name>');
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
