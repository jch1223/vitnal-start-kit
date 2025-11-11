#!/usr/bin/env node

import { Command } from 'commander';

import packageJson from '../package.json';

const handleCreate = (projectName: string): void => {
  const normalizedName = projectName.trim();

  if (!normalizedName) {
    console.error('Project name must not be empty.');
    process.exit(1);
  }

  // TODO: Replace with scaffold logic (copy template, install deps, etc.)
  console.log(`Project directory '${normalizedName}' will be created.`);
};

const configureCreateCommand = (program: Command): void => {
  program
    .command('create')
    .description('Generate a new Vitnal project in the target directory.')
    .argument('<project-name>', 'The name of the project directory to create')
    .action(handleCreate);
};

const program = new Command();

program
  .name('create-vitnal')
  .description('Bootstrap a Vitnal React + TypeScript project with curated defaults.')
  .version(packageJson.version ?? '0.0.0');

configureCreateCommand(program);

program.parseAsync(process.argv).catch(error => {
  console.error(error);
  process.exit(1);
});
