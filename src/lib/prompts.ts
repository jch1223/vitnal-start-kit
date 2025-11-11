import inquirer from 'inquirer';

import type { ProjectOptions, StateManagementOption } from '../types/options';

type PromptAnswers = {
  reactQuery: boolean;
  stateManagement: string;
  taskmaster: boolean;
};

const normalizeStateManagement = (choice: string): StateManagementOption => {
  const normalized = choice.toLowerCase();
  if (normalized === 'jotai' || normalized === 'zustand') {
    return normalized;
  }
  return 'none';
};

export const promptForOptions = async (): Promise<ProjectOptions> => {
  const answers = await inquirer.prompt<PromptAnswers>([
    {
      type: 'confirm',
      name: 'reactQuery',
      message: 'React Query를 사용하여 서버 상태를 관리하시겠습니까?',
      default: true,
    },
    {
      type: 'list',
      name: 'stateManagement',
      message: '어떤 클라이언트 상태 관리 라이브러리를 사용하시겠습니까?',
      choices: ['None', 'Jotai', 'Zustand'],
      default: 'None',
    },
    {
      type: 'confirm',
      name: 'taskmaster',
      message: 'Taskmaster (AI-powered task manager)를 설치하시겠습니까?',
      default: true,
    },
  ]);

  return {
    reactQuery: answers.reactQuery,
    stateManagement: normalizeStateManagement(answers.stateManagement),
    taskmaster: answers.taskmaster,
  };
};
