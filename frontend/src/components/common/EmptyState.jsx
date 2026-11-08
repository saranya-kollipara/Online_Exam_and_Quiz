import React from 'react';
import { HelpCircle } from 'lucide-react';
import styles from './EmptyState.module.css';

export default function EmptyState({
  icon = <HelpCircle size={28} />,
  title = 'No records found',
  description = 'There are no active entries matching your criteria.',
  action,
  className = ''
}) {
  return (
    <div className={`${styles.emptyState} ${className}`}>
      <div className={styles.iconWrapper}>{icon}</div>
      <h4 className={styles.title}>{title}</h4>
      <p className={styles.description}>{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

