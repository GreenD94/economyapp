'use client';
import styles from '../styles/Auth.module.css';
import { getFilteredDomains, appendDomain } from '../auth.helpers';
import { DomainPills, EyeToggle, RuleList } from './AuthFormParts';
import type { AuthFormCtx } from '../hooks/useAuthForm.hook';

export function RegisterSlider({ ctx }: { ctx: AuthFormCtx }) {
  const {
    regEmailRef, regPasswordRef, regConfirmRef,
    regEmail, setRegEmail, regPassword, setRegPassword, regConfirm, setRegConfirm,
    showRegPwd, toggleRegPwd, showRegConfirm, toggleRegConfirm,
    regEmailFocused, setRegEmailFocused,
    regEmailChecking, regApiError, setRegApiError, loading,
    regEmailInvalid, regEmailRules,
    regPasswordInvalid, regPasswordRules,
    regConfirmInvalid, regConfirmRules,
    handleRegNextEmail, handleRegNextPassword, handleRegSubmit,
    setRegisterStep, regTrack, regPage,
    goToLogin,
  } = ctx;

  return (
    <div className={styles.stepSlider}>
      <div className={styles.stepTrack} style={regTrack}>

        <div className={styles.stepPage} style={regPage}>
          <form onSubmit={handleRegNextEmail} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Correo electrónico</label>
              <input
                ref={regEmailRef}
                type="email"
                className={`${styles.input}${regEmailInvalid ? ' ' + styles.inputError : ''}`}
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                onFocus={() => setRegEmailFocused(true)}
                onBlur={() => setRegEmailFocused(false)}
                required autoComplete="email"
              />
              {regEmailFocused && getFilteredDomains(regEmail).length > 0 && (
                <DomainPills domains={getFilteredDomains(regEmail)}
                  onSelect={d => setRegEmail(appendDomain(d, regEmail))} />
              )}
              <RuleList rules={regEmailRules} />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={regEmailChecking}>
              {regEmailChecking ? 'Verificando...' : 'Siguiente'}
            </button>
            <p className={styles.link}>
              ¿Ya tienes cuenta?{' '}
              <button type="button" className={styles.linkBtn} onClick={goToLogin}>Inicia sesión</button>
            </p>
          </form>
        </div>

        <div className={styles.stepPage} style={regPage}>
          <form onSubmit={handleRegNextPassword} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Contraseña</label>
              <div className={styles.inputWrap}>
                <input
                  ref={regPasswordRef}
                  type={showRegPwd ? 'text' : 'password'}
                  className={`${styles.input}${regPasswordInvalid ? ' ' + styles.inputError : ''}`}
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  required autoComplete="new-password"
                />
                <EyeToggle show={showRegPwd} onToggle={toggleRegPwd} />
              </div>
              <RuleList rules={regPasswordRules} />
            </div>
            <button type="submit" className={styles.submitBtn}>Siguiente</button>
            <button type="button" className={styles.cancelBtn} onClick={() => setRegisterStep(1)}>Cancelar</button>
          </form>
        </div>

        <div className={styles.stepPage} style={regPage}>
          <form onSubmit={handleRegSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Confirmar contraseña</label>
              <div className={styles.inputWrap}>
                <input
                  ref={regConfirmRef}
                  type={showRegConfirm ? 'text' : 'password'}
                  className={`${styles.input}${regConfirmInvalid ? ' ' + styles.inputError : ''}`}
                  value={regConfirm}
                  onChange={e => setRegConfirm(e.target.value)}
                  required autoComplete="new-password"
                />
                <EyeToggle show={showRegConfirm} onToggle={toggleRegConfirm} />
              </div>
              <RuleList rules={regConfirmRules} />
            </div>
            {regApiError && <p className={styles.error}>{regApiError}</p>}
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
            <button type="button" className={styles.cancelBtn}
              onClick={() => { setRegApiError(null); setRegisterStep(2); }}>
              Cancelar
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
