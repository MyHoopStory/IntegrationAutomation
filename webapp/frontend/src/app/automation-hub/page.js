'use client';

import { useEffect } from 'react';
import Navigation from '../components/Navigation';
import styles from '../styles/shared.module.css';

export default function AutomationHub() {
  useEffect(() => {
    window.location.href = 'https://awx.lvic-techlab.com';
  }, []);

  return (
    <>
      <Navigation />
      <div className={styles.container}>
        <div className={styles.card}>
          <h1>Redirecting to Automation Hub...</h1>
          <p>You will be redirected to AWX in a moment.</p>
        </div>
      </div>
    </>
  );
} 