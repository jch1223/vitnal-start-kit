#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .name('create-vitnal')
  .description('Bootstrap a Vitnal React + TypeScript project with curated defaults.')
  .version('0.1.0');

program
  .command('create')
  .description('Generate a new Vitnal project in the target directory.')
  .argument('<project-name>', 'The name of the project directory to create')
  .action((projectName: string) => {
    // TODO: Replace with scaffold logic (copy template, install deps, etc.)
    console.log(`Project directory '${projectName}' will be created.`);
  });

program.parse(process.argv);
