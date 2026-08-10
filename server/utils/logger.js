// A minimal leveled-logging wrapper around console — not a replacement for
// a real structured logger (pino/winston) if this project ever needs JSON
// logs for a log aggregator, but enough today to filter routine noise
// (e.g. every socket connect/disconnect) out of production logs without
// pulling in a new dependency for it.
//
// LOG_LEVEL controls the minimum level printed: 'debug' | 'info' | 'warn'
// | 'error'. Defaults to 'info', so debug() calls are silent unless
// explicitly enabled — set LOG_LEVEL=debug locally to see them.

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const currentLevel = LEVELS[process.env.LOG_LEVEL] ?? LEVELS.info;

function makeLogger(level, consoleFn) {
  return (...args) => {
    if (LEVELS[level] >= currentLevel) consoleFn(...args);
  };
}

module.exports = {
  debug: makeLogger('debug', console.log),
  info: makeLogger('info', console.log),
  warn: makeLogger('warn', console.warn),
  error: makeLogger('error', console.error),
};
