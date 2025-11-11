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

const configureCreateCommand = (program: Command): void => {
  program
    .command('create')
    .description('Generate a new Vitnal project in the target directory.')
    .argument('<project-name>', 'The name of the project directory to create')
    .action(async (projectName: string) => {
      try {
        await executeCreateCommand(projectName);
      } catch (error) {
        console.error('Failed to create project:', error);
        process.exit(1);
      }
    });
};

const program = new Command();

program
  .name('create-vitnal')
  .description('Bootstrap a Vitnal React + TypeScript project with curated defaults.')
  .version(packageJson.version ?? '0.0.0');

configureCreateCommand(program);

program.parseAsync(process.argv).catch((error) => {
  console.error(error);
  process.exit(1);
});
