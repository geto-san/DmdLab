// Domains accepted for the join-the-team application form: personal
// providers plus the university's student email domain.
export const ALLOWED_EMAIL_DOMAINS = ["gmail.com", "outlook.com", "std.must.ac.ug"];

export function isAllowedApplicantEmail(email: string): boolean {
  const match = /^[^\s@]+@([^\s@]+)$/.exec(email.trim().toLowerCase());
  if (!match) return false;
  return ALLOWED_EMAIL_DOMAINS.includes(match[1]);
}
