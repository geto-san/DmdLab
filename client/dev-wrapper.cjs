#!/usr/bin/env node
const { spawn } = require('child_process');

// Start the npm dev script (which runs vite)
const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'dev'], { stdio: 'inherit' });

function handleSignal(sig) {
  console.log(`\nReceived ${sig}, forwarding to child process...`);
  try {
    child.kill(sig);
  } catch (e) {
    // ignore
  }
}

process.on('SIGINT', () => handleSignal('SIGINT'));
process.on('SIGTERM', () => handleSignal('SIGTERM'));
process.on('exit', (code) => {
  if (!child.killed) child.kill('SIGTERM');
  process.exit(code);
});

child.on('exit', (code, signal) => {
  if (signal) console.log(`Child exited by signal ${signal}`);
  process.exit(code === null ? 0 : code);
});
