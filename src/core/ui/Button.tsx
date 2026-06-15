import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
};

export function Button({ variant = 'primary', icon, className = '', children, ...props }: ButtonProps) {
  return (
    <button className={`${styles.button} ${styles[variant]} ${className}`} {...props}>
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <span>{children}</span>
    </button>
  );
}
