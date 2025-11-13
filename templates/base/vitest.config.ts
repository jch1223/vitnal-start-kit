import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// https://vitest.dev/config/
// Storybook 프로젝트는 항상 정의하여 Storybook 애드온이 프로젝트를 찾을 수 있도록 함
// `projects`가 정의되면 기본 프로젝트가 사라지므로 기본 프로젝트도 명시적으로 정의 필요
// 일반 테스트 실행 시 (`npm test`)에는 기본 프로젝트만 실행됨
// Storybook 테스트 실행 시 (`npm run test:storybook`)에는 `--project=storybook`으로 명시적으로 실행
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    css: true,
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
    projects: [
      // 기본 프로젝트 (일반 단위 테스트용)
      {
        test: {
          name: 'default',
          globals: true,
          environment: 'jsdom',
          css: true,
          setupFiles: ['./src/test/setup.ts'],
        },
      },
      // Storybook 프로젝트 (Storybook 테스트용)
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});
