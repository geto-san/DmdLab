const logger = require('./logger');

// Centralizes the 5xx error-response policy so it can't drift between
// route files the way it had (some routes leaked err.message to the
// client, one used {message} instead of {error}, several swallowed the
// real error with a bare `catch {}` and never logged it).
//
// Policy: 4xx responses (validation, not-found) can and should have
// specific, safe messages written inline at the call site — those are
// meant for the client to act on. 5xx responses are for genuinely
// unexpected failures: the client always gets the same generic message
// (never the raw error, which could leak internals), while the real
// error is always logged server-side so it's actually debuggable.
function sendServerError(res, err, context, publicMessage = 'Something went wrong') {
  logger.error(`[${context}]`, err && err.stack ? err.stack : err);
  res.status(500).json({ error: publicMessage });
}

module.exports = { sendServerError };
