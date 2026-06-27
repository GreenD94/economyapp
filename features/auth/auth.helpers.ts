export type TokenResponse = { access_token: string };
export type UserResponse  = { id: number; email: string; is_active: boolean; roles: string[] };

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const DOMAINS  = ['@gmail.com', '@hotmail.com', '@yahoo.com', '@icloud.com'];

export function appendDomain(domain: string, email: string): string {
  const at = email.indexOf('@');
  return (at >= 0 ? email.slice(0, at) : email) + domain;
}

export function getFilteredDomains(email: string): string[] {
  const at = email.indexOf('@');
  if (at < 0) return [];
  const typed   = email.slice(at + 1).toLowerCase();
  const matches = DOMAINS.filter(d => d.slice(1).startsWith(typed));
  if (matches.length === 1 && matches[0].slice(1) === typed) return [];
  return matches;
}
