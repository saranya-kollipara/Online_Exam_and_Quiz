import React from 'react';
import styles from './Badge.module.css';

export default function Badge({
  children,
  variant = 'primary',
  dot = false,
  className = ''
}) {
  const variantClass = styles[variant] || styles.primary;

  return (
    <span className={`${styles.badge} ${variantClass} ${className}`}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
}

