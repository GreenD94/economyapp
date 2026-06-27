'use client';
import styles from '../styles/Auth.module.css';
import { useAuthForm }    from '../hooks/useAuthForm.hook';
import { LoginSlider }    from '../components/LoginSlider';
import { RegisterSlider } from '../components/RegisterSlider';

export function AuthContainer() {
  const ctx = useAuthForm();
  const { mode, mainTrack, mainPage } = ctx;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--c-hdr)' }}>savings</span>
        <h1 className={styles.title}>Economy Tracker</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.formGroup}>
          <p className={styles.subtitle} style={{ opacity: mode === 'register' ? 1 : 0, transition: 'opacity 280ms' }}>
            Crear cuenta
          </p>
          <div className={styles.stepSlider}>
            <div className={styles.stepTrack} style={mainTrack}>
              <div className={styles.stepPage} style={mainPage}>
                <LoginSlider ctx={ctx} />
              </div>
              <div className={styles.stepPage} style={mainPage}>
                <RegisterSlider ctx={ctx} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
