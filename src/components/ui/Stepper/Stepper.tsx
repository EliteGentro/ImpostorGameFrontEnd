import React from 'react';
import styles from './Stepper.module.css';
import { Button } from '../Button';

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  value,
  onChange,
  min = 1,
  max = 10,
  label,
}) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className={styles.container}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.controls}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDecrement}
          disabled={value <= min}
          aria-label="Decrease"
        >
          −
        </Button>
        <span className={styles.value}>{value}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleIncrement}
          disabled={value >= max}
          aria-label="Increase"
        >
          +
        </Button>
      </div>
    </div>
  );
};
