import React from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  description,
}) => {
  const id = `checkbox-${Math.random().toString(36).substring(7)}`;

  return (
    <label htmlFor={id} className={styles.container}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={styles.input}
      />
      <span className={`${styles.checkmark} ${checked ? styles.checked : ''}`}>
        {checked && (
          <svg viewBox="0 0 24 24" className={styles.icon}>
            <path
              fill="currentColor"
              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
            />
          </svg>
        )}
      </span>
      <div className={styles.content}>
        <span className={styles.label}>{label}</span>
        {description && <span className={styles.description}>{description}</span>}
      </div>
    </label>
  );
};
