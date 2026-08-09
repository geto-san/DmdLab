#!/usr/bin/env node
// Generates a bcrypt hash for the ADMIN_PASS_HASH env var.
//
// Usage:
//   node server/scripts/hash-admin-password.js "your-new-password"
//
// Copy the printed hash into ADMIN_PASS_HASH in your .env (and remove the
// legacy plaintext ADMIN_PASS, if set).

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Usage: node server/scripts/hash-admin-password.js "your-new-password"');
  process.exit(1);
}

if (password.length < 8) {
  console.warn('⚠️  That password is under 8 characters — consider something longer.');
}

const hash = bcrypt.hashSync(password, 12);
console.log('\nADMIN_PASS_HASH=' + hash + '\n');
console.log('Copy the line above into server/.env, then remove ADMIN_PASS if it is still set.');
