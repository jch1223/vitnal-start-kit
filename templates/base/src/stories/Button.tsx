import type { ComponentPropsWithoutRef } from 'react';

const sizeClassMap = {
  small: 'px-3 py-1 text-sm',
  medium: 'px-4 py-2 text-base',
  large: 'px-5 py-3 text-lg',
} satisfies Record<ButtonSize, string>;

const variantClassMap = {
  primary: 'bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-400',
  secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 focus:ring-slate-400',
} satisfies Record<ButtonVariant, string>;

type ButtonSize = 'small' | 'medium' | 'large';
type ButtonVariant = 'primary' | 'secondary';

export type ButtonProps = {
  label: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
} & Pick<ComponentPropsWithoutRef<'button'>, 'onClick' | 'type' | 'aria-label'>;

export const Button = ({
  label,
  size = 'medium',
  variant = 'primary',
  type = 'button',
  onClick,
  'aria-label': ariaLabel,
}: ButtonProps) => (
  <button
    type={type}
    aria-label={ariaLabel ?? label}
    onClick={onClick}
    className={[
      'inline-flex items-center justify-center rounded-full font-medium transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:outline-none',
      sizeClassMap[size],
      variantClassMap[variant],
    ].join(' ')}
  >
    {label}
  </button>
);
