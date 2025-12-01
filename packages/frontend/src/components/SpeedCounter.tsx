'use client';

import { useState, useEffect } from 'react';
import styles from './SpeedCounter.module.css';

export default function SpeedCounter() {
  const [speed, setSpeed] = useState(50);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed((prevSpeed) => {
        const nextSpeed = prevSpeed + Math.floor(Math.random() * 30) + 10;
        return nextSpeed > 329 ? 50 : nextSpeed;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.speedContainer}>
      <div className={styles.speedWrapper}>
        <span key={speed} className={styles.speedNumber}>
          {speed}
        </span>
      </div>
      <span className={styles.speedUnit}>+ Mbps</span>
    </div>
  );
}
