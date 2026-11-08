import React from 'react';
import styles from './Input.module.css';

export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helper,
  required = false,
  leftIcon,
  rightIcon,
  onRightIconClick,
  disabled = false,
  as = 'input',
  children,
  className = '',
  ...rest
}) {
  const Component = as;

  return (
    <div className={`${styles.container} ${className}`}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={`${styles.inputWrapper} ${error ? styles.hasError : ''}`}>
        {leftIcon && <span className={styles.iconLeft}>{leftIcon}</span>}
        <Component
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={as === 'textarea' ? styles.textarea : as === 'select' ? styles.select : styles.input}
          {...rest}
        >
          {children}
        </Component>
        {rightIcon && (
          <span className={styles.iconRight} onClick={onRightIconClick}>
            {rightIcon}
          </span>
        )}
      </div>

      {error ? (
        <span className={styles.error}>{error}</span>
      ) : helper ? (
        <span className={styles.helper}>{helper}</span>
      ) : null}
    </div>
  );
}

