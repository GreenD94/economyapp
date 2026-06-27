'use client';
import styles from '../styles/Auth.module.css';
import { getFilteredDomains, appendDomain } from '../auth.helpers';
import { DomainPills, EyeToggle, RuleList } from './AuthFormParts';
import type { AuthFormCtx } from '../hooks/useAuthForm.hook';

export function LoginSlider({ ctx }: { ctx: AuthFormCtx }) {
  const {
    loginEmailRef, loginPasswordRef,
    loginEmail, setLoginEmail, loginPassword, setLoginPassword,
    showLoginPwd, toggleLoginPwd,
    loginEmailFocused, setLoginEmailFocused,
    loginEmailNotFound, setLoginEmailNotFound,
    loginEmailChecking, loginEmailInvalid, loginEmailRules,
    loginApiError, setLoginApiError, loading,
    handleLoginNextEmail, handleLoginSubmit,
    setLoginStep, loginTrack, loginPage,
    goToRegister,
  } = ctx;

  return (
    <div className={styles.stepSlider}>
      <div className={styles.stepTrack} style={loginTrack}>

        <div className={styles.stepPage} style={loginPage}>
          <form onSubmit={handleLoginNextEmail} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Correo electrónico</label>
              <input
                ref={loginEmailRef}
                type="email"
                className={`${styles.input}${loginEmailInvalid ? ' ' + styles.inputError : ''}`}
                value={loginEmail}
                onChange={e => { setLoginEmail(e.target.value); setLoginEmailNotFound(false); }}
                onFocus={() => setLoginEmailFocused(true)}
                onBlur={() => setLoginEmailFocused(false)}
                required autoComplete="email"
              />
              {loginEmailFocused && getFilteredDomains(loginEmail).length > 0 && (
                <DomainPills domains={getFilteredDomains(loginEmail)}
                  onSelect={d => setLoginEmail(appendDomain(d, loginEmail))} />
              )}
              <RuleList rules={loginEmailRules} />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loginEmailChecking}>
              {loginEmailChecking ? 'Verificando...' : 'Siguiente'}
            </button>
            <p className={styles.link}>
              ¿No tienes cuenta?{' '}
              <button type="button" className={styles.linkBtn} onClick={goToRegister}>Regístrate aquí</button>
            </p>
          </form>
        </div>

        <div className={styles.stepPage} style={loginPage}>
          <form onSubmit={handleLoginSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Contraseña</label>
              <div className={styles.inputWrap}>
                <input
                  ref={loginPasswordRef}
                  type={showLoginPwd ? 'text' : 'password'}
                  className={styles.input}
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  required autoComplete="current-password"
                />
                <EyeToggle show={showLoginPwd} onToggle={toggleLoginPwd} />
              </div>
            </div>
            {loginApiError && <p className={styles.error}>{loginApiError}</p>}
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <button type="button" className={styles.cancelBtn}
              onClick={() => { setLoginApiError(null); setLoginStep(1); }}>
              Cancelar
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
