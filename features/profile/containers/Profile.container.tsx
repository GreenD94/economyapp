'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { apiPut } from '@/features/core/utils/api.client';
import { ConfirmModal } from '@/features/core/components/ConfirmModal.component';
import styles from '../styles/Profile.module.css';

export function ProfileContainer() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdSaved, setPwdSaved] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwdError(null);
    if (newPwd !== confirmPwd) {
      setPwdError('Las contraseñas nuevas no coinciden');
      return;
    }
    if (newPwd.length < 8) {
      setPwdError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    setPwdLoading(true);
    try {
      await apiPut('/api/v1/auth/password', {
        current_password: currentPwd,
        new_password: newPwd,
      });
      setPwdSaved(true);
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
      setTimeout(() => setPwdSaved(false), 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('401')) {
        setPwdError('Contraseña actual incorrecta');
      } else {
        setPwdError('Error al cambiar la contraseña');
      }
    } finally {
      setPwdLoading(false);
    }
  }

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  return (
    <div className={styles.page}>
      <div className={styles.section}>
        <span className={styles.sectionTitle}>Mi Cuenta</span>
        <div className={styles.emailRow}>
          <span className={styles.emailIcon}>
            <span className="material-symbols-outlined">account_circle</span>
          </span>
          <span className={styles.email}>{user?.email}</span>
        </div>
        <button
          className={styles.dangerBtn}
          onClick={() => router.push('/settings')}
          style={{ borderColor: 'var(--c-hdr)', color: 'var(--c-hdr)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 4 }}>settings</span>
          Ir a Ajustes
        </button>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionTitle}>Cambiar Contraseña</span>
        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className={styles.field}>
            <label className={styles.label}>Contraseña actual</label>
            <input type="password" className={styles.input} value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} required autoComplete="current-password" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Nueva contraseña</label>
            <input type="password" className={styles.input} value={newPwd} onChange={e => setNewPwd(e.target.value)} required autoComplete="new-password" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Confirmar nueva contraseña</label>
            <input type="password" className={styles.input} value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} required autoComplete="new-password" />
          </div>
          {pwdError && <p className={styles.error}>{pwdError}</p>}
          {pwdSaved && <p className={styles.savedMsg}>Contraseña actualizada</p>}
          <button type="submit" className={styles.saveBtn} disabled={pwdLoading}>
            {pwdLoading ? 'Guardando...' : 'Cambiar contraseña'}
          </button>
        </form>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionTitle}>Sesión</span>
        <button className={styles.dangerBtn} onClick={() => setLogoutOpen(true)}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 4 }}>logout</span>
          Cerrar sesión
        </button>
      </div>

      <ConfirmModal
        open={logoutOpen}
        message="¿Seguro que quieres cerrar sesión?"
        onConfirm={handleLogout}
        onClose={() => setLogoutOpen(false)}
        danger
      />
    </div>
  );
}
