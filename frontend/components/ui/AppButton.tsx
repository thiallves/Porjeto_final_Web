import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  children: ReactNode;
};

export function AppButton({ className, variant = 'primary', children, ...props }: Props) {
  return (
    <button className={clsx('app-button', `app-button--${variant}`, className)} {...props}>
      {children}
    </button>
  );
}
