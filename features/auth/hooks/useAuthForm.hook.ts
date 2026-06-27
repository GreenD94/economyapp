'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { apiGet, apiPost } from '@/features/core/utils/api.client';
import { EMAIL_RE, getFilteredDomains, type TokenResponse, type UserResponse } from '../auth.helpers';

export function useAuthForm() {
  const pathname = usePathname();
  const [mode, setMode] = useState<'login' | 'register'>(pathname === '/register' ? 'register' : 'login');
  const [loginStep,    setLoginStep]    = useState(1);
  const [registerStep, setRegisterStep] = useState(1);

  const [loginEmail,    setLoginEmail]    = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regEmail,      setRegEmail]      = useState('');
  const [regPassword,   setRegPassword]   = useState('');
  const [regConfirm,    setRegConfirm]    = useState('');

  const [showLoginPwd,   setShowLoginPwd]   = useState(false);
  const [showRegPwd,     setShowRegPwd]     = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  const [loginEmailFocused, setLoginEmailFocused] = useState(false);
  const [regEmailFocused,   setRegEmailFocused]   = useState(false);

  const [loginEmailNotFound, setLoginEmailNotFound] = useState(false);
  const [loginEmailChecking, setLoginEmailChecking] = useState(false);
  const [regEmailExists,     setRegEmailExists]     = useState(false);
  const [regEmailChecking,   setRegEmailChecking]   = useState(false);

  const [loginApiError, setLoginApiError] = useState<string | null>(null);
  const [regApiError,   setRegApiError]   = useState<string | null>(null);
  const [loading,       setLoading]       = useState(false);

  const loginEmailRef    = useRef<HTMLInputElement>(null);
  const loginPasswordRef = useRef<HTMLInputElement>(null);
  const regEmailRef      = useRef<HTMLInputElement>(null);
  const regPasswordRef   = useRef<HTMLInputElement>(null);
  const regConfirmRef    = useRef<HTMLInputElement>(null);

  const { login } = useAuth();
  const router    = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      if (mode === 'login') {
        if (loginStep === 1) loginEmailRef.current?.focus();
        if (loginStep === 2) loginPasswordRef.current?.focus();
      } else {
        if (registerStep === 1) regEmailRef.current?.focus();
        if (registerStep === 2) regPasswordRef.current?.focus();
        if (registerStep === 3) regConfirmRef.current?.focus();
      }
    }, 300);
    return () => clearTimeout(t);
  }, [mode, loginStep, registerStep]);

  useEffect(() => {
    setRegEmailExists(false);
    if (!EMAIL_RE.test(regEmail)) { setRegEmailChecking(false); return; }
    setRegEmailChecking(true);
    const t = setTimeout(async () => {
      try {
        const res = await apiGet<{ exists: boolean }>(`/api/v1/auth/check-email?email=${encodeURIComponent(regEmail)}`);
        setRegEmailExists(res.exists);
      } catch { setRegEmailExists(false); }
      finally  { setRegEmailChecking(false); }
    }, 600);
    return () => clearTimeout(t);
  }, [regEmail]);

  const loginEmailRules = [
    { label: 'Falta el símbolo @',              broken: loginEmail.length >= 3 && !loginEmail.includes('@') },
    { label: 'Falta el dominio (ej. gmail.com)', broken: loginEmail.includes('@') && !EMAIL_RE.test(loginEmail) },
    { label: 'Este correo no está registrado',   broken: loginEmailNotFound },
  ];
  const loginEmailInvalid = loginEmailRules.some(r => r.broken);

  const regEmailRules = [
    { label: 'Falta el símbolo @',              broken: regEmail.length >= 3 && !regEmail.includes('@') },
    { label: 'Falta el dominio (ej. gmail.com)', broken: regEmail.includes('@') && !EMAIL_RE.test(regEmail) },
    { label: 'Este correo ya está registrado',   broken: regEmailExists },
  ];
  const regEmailInvalid = regEmailRules.some(r => r.broken);

  const regPasswordRules = [
    { label: 'Mínimo 8 caracteres', broken: regPassword.length > 0 && regPassword.length < 8 },
    { label: 'Al menos un número',  broken: regPassword.length > 0 && !/\d/.test(regPassword) },
    { label: 'Al menos una letra',  broken: regPassword.length > 0 && !/[a-zA-Z]/.test(regPassword) },
  ];
  const regPasswordInvalid = regPasswordRules.some(r => r.broken);

  const regConfirmRules = [
    { label: 'Las contraseñas no coinciden', broken: regConfirm.length > 0 && regConfirm !== regPassword },
  ];
  const regConfirmInvalid = regConfirmRules.some(r => r.broken);

  function goToRegister() { setMode('register'); window.history.replaceState(null, '', '/register'); }
  function goToLogin()    { setMode('login');    window.history.replaceState(null, '', '/login');    }

  async function handleLoginNextEmail(e: React.FormEvent) {
    e.preventDefault();
    if (loginEmailInvalid || !loginEmail) return;
    setLoginEmailChecking(true);
    try {
      const res = await apiGet<{ exists: boolean }>(`/api/v1/auth/check-email?email=${encodeURIComponent(loginEmail)}`);
      if (!res.exists) { setLoginEmailNotFound(true); return; }
      setLoginStep(2);
    } catch { setLoginStep(2); }
    finally  { setLoginEmailChecking(false); }
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoginApiError(null); setLoading(true);
    try {
      const { access_token } = await apiPost<TokenResponse>('/api/v1/auth/login', { email: loginEmail, password: loginPassword });
      localStorage.setItem('auth_token', access_token);
      const me = await apiGet<UserResponse>('/api/v1/auth/me');
      login(access_token, { id: me.id, email: me.email });
      try { await apiGet('/api/v1/settings'); router.push('/'); }
      catch { router.push('/onboarding'); }
    } catch { setLoginApiError('Correo o contraseña incorrectos'); }
    finally  { setLoading(false); }
  }

  function handleRegNextEmail(e: React.FormEvent) {
    e.preventDefault();
    if (regEmailInvalid || !regEmail || regEmailChecking) return;
    setRegisterStep(2);
  }
  function handleRegNextPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!regPassword || regPasswordInvalid) return;
    setRegisterStep(3);
  }
  async function handleRegSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (regConfirmInvalid || !regConfirm) return;
    setRegApiError(null); setLoading(true);
    try {
      const { access_token } = await apiPost<TokenResponse>('/api/v1/auth/register', { email: regEmail, password: regPassword });
      localStorage.setItem('auth_token', access_token);
      const me = await apiGet<UserResponse>('/api/v1/auth/me');
      login(access_token, { id: me.id, email: me.email });
      router.push('/onboarding');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      setRegApiError(msg.includes('409') ? 'Este correo ya está registrado' : 'No se pudo crear la cuenta. Intenta de nuevo.');
    } finally { setLoading(false); }
  }

  const mainTrack  = { width: '200%', transform: `translateX(${mode === 'login' ? 0 : -50}%)` };
  const mainPage   = { width: '50%' };
  const loginTrack = { width: '200%', transform: `translateX(${(loginStep - 1) * -50}%)` };
  const loginPage  = { width: '50%' };
  const regTrack   = { width: '300%', transform: `translateX(${(registerStep - 1) * -(100 / 3)}%)` };
  const regPage    = { width: `${100 / 3}%` };

  return {
    mode, goToRegister, goToLogin,
    loginStep, loginEmail, setLoginEmail, loginPassword, setLoginPassword,
    showLoginPwd, toggleLoginPwd: () => setShowLoginPwd(v => !v),
    loginEmailFocused, setLoginEmailFocused,
    loginEmailNotFound, setLoginEmailNotFound,
    loginEmailChecking, loginApiError, loading,
    loginEmailRules, loginEmailInvalid,
    handleLoginNextEmail, handleLoginSubmit,
    setLoginStep, setLoginApiError,
    loginEmailRef, loginPasswordRef,
    registerStep, setRegisterStep,
    regEmail, setRegEmail, regPassword, setRegPassword, regConfirm, setRegConfirm,
    showRegPwd,     toggleRegPwd:     () => setShowRegPwd(v => !v),
    showRegConfirm, toggleRegConfirm: () => setShowRegConfirm(v => !v),
    regEmailFocused, setRegEmailFocused,
    regEmailChecking, regApiError, setRegApiError,
    regEmailRules, regEmailInvalid,
    regPasswordRules, regPasswordInvalid,
    regConfirmRules, regConfirmInvalid,
    handleRegNextEmail, handleRegNextPassword, handleRegSubmit,
    regEmailRef, regPasswordRef, regConfirmRef,
    mainTrack, mainPage, loginTrack, loginPage, regTrack, regPage,
  };
}

export type AuthFormCtx = ReturnType<typeof useAuthForm>;
