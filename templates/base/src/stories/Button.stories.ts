import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';

import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
    },
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary'],
    },
  },
  args: {
    label: 'Run generator',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Interaction: Story = {
  args: {
    label: 'Copy command',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = await canvas.getByRole('button', { name: /copy command/i });

    await step('Focus button via keyboard', async () => {
      await userEvent.tab();
      await expect(button).toHaveFocus();
    });

    await step('Activate via keyboard', async () => {
      await userEvent.keyboard('{Enter}');
      await expect(button).toHaveFocus();
    });
  },
};
