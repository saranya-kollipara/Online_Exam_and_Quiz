import React from 'react';
import styles from './Card.module.css';

export default function Card({
  children,
  title,
  subtitle,
  action,
  hoverable = true,
  interactive = false,
  glow = false,
  secondaryGlow = false,
  className = '',
  onClick,
  ...rest
}) {
  return (
    <div
      className={`
        ${styles.card}
        ${hoverable ? styles.hoverable : ''}
        ${interactive ? styles.interactive : ''}
        ${glow ? styles.glow : ''}
        ${secondaryGlow ? styles.secondaryGlow : ''}
        ${className}
      `}
      onClick={onClick}
      {...rest}
    >
      {(title || subtitle || action) && (
        <div className={styles.header}>
          <div>
            {title && <h3 className={styles.title}>{title}</h3>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

