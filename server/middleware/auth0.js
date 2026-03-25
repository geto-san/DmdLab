const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const domain = process.env.AUTH0_DOMAIN;
const audience = process.env.AUTH0_AUDIENCE;

if (!domain) {
  console.warn('Auth0 domain not configured — Auth0 JWT validation disabled.');
}

// If domain is not configured, return a noop middleware so server keeps working in dev.
if (!domain) {
  module.exports = (req, res, next) => next();
  return;
}

// Build jwt options conditionally — only include audience when provided.
const jwtOptions = {
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`,
  }),
  issuer: `https://${domain}/`,
  algorithms: ['RS256'],
};

if (audience && audience.trim().length > 0) {
  jwtOptions.audience = audience;
} else {
  console.warn('AUTH0_AUDIENCE is empty — token audience will not be validated.');
}

const checkJwt = jwt(jwtOptions).unless({
  path: [
    // public endpoints — keep as needed
    /^\/announcements/,
    /^\/videos/,
    /^\/articles/,
  ],
});

module.exports = checkJwt;