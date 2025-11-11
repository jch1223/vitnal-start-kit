export type StateManagementOption = 'none' | 'jotai' | 'zustand';

export interface ProjectOptions {
  reactQuery: boolean;
  stateManagement: StateManagementOption;
  taskmaster: boolean;
}

