import React from 'react';
import styles from './Button.module.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  onClick,
  ...rest
}) {
  const variantClass = styles[variant] || styles.primary;
  const sizeClass = styles[size] || styles.md;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${styles.btn} ${variantClass} ${sizeClass} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {isLoading ? (
        <span className={styles.spinner} />
      ) : (
        leftIcon && <span style={{ display: 'inline-flex' }}>{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <span style={{ display: 'inline-flex' }}>{rightIcon}</span>
      )}
    </button>
  );
}

