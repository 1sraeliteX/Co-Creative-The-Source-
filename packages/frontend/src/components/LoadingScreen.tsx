'use client';

import { useEffect, useState } from 'react';
import styles from '../app/loading.module.css';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.logoContainer}>
        <img src="/logo1.png" alt="The Source HUB" className={styles.logo} />
      </div>
      <div className={styles.spinner}></div>
      <div className={styles.loadingText}>Loading your creative space...</div>
      <div className={styles.progressBar}>
        <div className={styles.progressFill}></div>
      </div>
    </div>
  );
}
