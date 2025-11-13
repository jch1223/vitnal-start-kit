import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    // Storybook Vitest 애드온의 동적 import 오류 해결
    // https://github.com/storybookjs/storybook/issues/31599
    // https://github.com/storybookjs/storybook/issues/32049
    config.optimizeDeps = {
      ...config.optimizeDeps,
      exclude: [...(config.optimizeDeps?.exclude || []), '@storybook/addon-vitest'],
      include: [
        ...(config.optimizeDeps?.include || []),
        'react',
        'react-dom',
        'react/jsx-dev-runtime',
      ],
    };
    return config;
  },
};
export default config;
