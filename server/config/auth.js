// Centralized admin-auth configuration. Both admin.controller.js and
// adminAuth.js import from here so the JWT secret (and its documented
// insecure default) can never drift between the two.
//
// Credentials:
//   - ADMIN_PASS_HASH (preferred) — a bcrypt hash, generated with
//     `node server/scripts/hash-admin-password.js "your password"`.
//   - ADMIN_PASS (legacy) — plaintext password, only used if
//     ADMIN_PASS_HASH is not set. Kept for easy local dev only.
//
// In production (NODE_ENV=production), checkProductionSafety() refuses to
// boot the server if the JWT secret or admin password are missing or still
// set to the documented defaults below.

const INSECURE_DEFAULTS = {
  user: 'admin',
  pass: 'password',
  secret: 'deepminds-secret',
};

const ADMIN_USER = process.env.ADMIN_USER || INSECURE_DEFAULTS.user;
const ADMIN_PASS = process.env.ADMIN_PASS || null; // legacy plaintext, optional
const ADMIN_PASS_HASH = process.env.ADMIN_PASS_HASH || null; // preferred: bcrypt hash
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || INSECURE_DEFAULTS.secret;
const JWT_EXPIRES = process.env.ADMIN_JWT_EXPIRES || '8h';

const logger = require('../utils/logger');

function checkProductionSafety() {
  if (process.env.NODE_ENV !== 'production') return;

  const problems = [];
  if (JWT_SECRET === INSECURE_DEFAULTS.secret) {
    problems.push('ADMIN_JWT_SECRET is missing or still set to the documented insecure default');
  }
  if (!ADMIN_PASS_HASH && (!ADMIN_PASS || ADMIN_PASS === INSECURE_DEFAULTS.pass)) {
    problems.push('Set ADMIN_PASS_HASH (preferred, a bcrypt hash) or a non-default ADMIN_PASS');
  }
  if (ADMIN_USER === INSECURE_DEFAULTS.user) {
    // Not fatal on its own, but worth a loud warning — a known username
    // halves the brute-force search space.
    logger.warn('⚠️  ADMIN_USER is still the default "admin" — consider changing it in production.');
  }

  if (problems.length) {
    logger.error('❌ Refusing to start in production with insecure admin auth configuration:');
    problems.forEach((p) => logger.error(`   - ${p}`));
    process.exit(1);
  }
}

module.exports = {
  ADMIN_USER,
  ADMIN_PASS,
  ADMIN_PASS_HASH,
  JWT_SECRET,
  JWT_EXPIRES,
  INSECURE_DEFAULTS,
  checkProductionSafety,
};
