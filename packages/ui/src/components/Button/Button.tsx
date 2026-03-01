import React from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Whether the button fills its container width */
  fullWidth?: boolean;
  /** Loading state — disables the button and shows a spinner */
  isLoading?: boolean;
  /** Icon to display before the label */
  iconLeft?: React.ReactNode;
  /** Icon to display after the label */
  iconRight?: React.ReactNode;
}

/**
 * `Button` is the primary interactive element of the design system.
 *
 * Use `variant` to convey intent and `size` to adapt to its context.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      iconLeft,
      iconRight,
      children,
      disabled,
      className,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={[
          styles.button,
          styles[`variant-${variant}`],
          styles[`size-${size}`],
          fullWidth ? styles.fullWidth : '',
          isLoading ? styles.loading : '',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        disabled={isDisabled}
        aria-busy={isLoading}
        {...rest}
      >
        {isLoading && (
          <span className={styles.spinner} aria-hidden="true" />
        )}
        {!isLoading && iconLeft && (
          <span className={styles.iconLeft} aria-hidden="true">
            {iconLeft}
          </span>
        )}
        <span className={styles.label}>{children}</span>
        {!isLoading && iconRight && (
          <span className={styles.iconRight} aria-hidden="true">
            {iconRight}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
