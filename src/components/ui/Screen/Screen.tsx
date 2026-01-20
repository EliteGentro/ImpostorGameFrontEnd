import React from 'react';
import styles from './Screen.module.css';

interface ScreenProps {
  children: React.ReactNode;
  centered?: boolean;
}

export const Screen: React.FC<ScreenProps> = ({ children, centered = false }) => {
  return (
    <div className={`${styles.screen} ${centered ? styles.centered : ''}`}>
      {children}
    </div>
  );
};

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, subtitle }) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
};

interface ScreenContentProps {
  children: React.ReactNode;
}

export const ScreenContent: React.FC<ScreenContentProps> = ({ children }) => {
  return <main className={styles.content}>{children}</main>;
};

interface ScreenFooterProps {
  children: React.ReactNode;
}

export const ScreenFooter: React.FC<ScreenFooterProps> = ({ children }) => {
  return <footer className={styles.footer}>{children}</footer>;
};
