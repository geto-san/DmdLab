<?php
/**
 * Configuration loader
 * Loads values from .env or env.example, provides config array
 */

$config = [
  'APP_NAME' => 'DMRLab',
  'APP_DESCRIPTION' => 'Deepminds Research Lab — advancing AI research',
  'SITE_URL' => 'http://localhost',
  'YOUTUBE_CHANNEL_ID' => '',
  'YOUTUBE_CHANNEL_URL' => 'https://www.youtube.com/@MLinQC',
  'CONTACT_EMAIL' => 'kimrichies@gmail.com',
  'CONTACT_PHONE' => '+256 774 437989',
  'CONTACT_LOCATION' => 'MUST, Kihumuro Campus',
  'GITHUB_URL' => 'https://github.com/',
  'YOUTUBE_URL' => 'https://www.youtube.com/@MLinQC',
  'LINKEDIN_URL' => '',
  'TWITTER_URL' => '',
  'API_BASE_URL' => 'http://localhost:8500',
];

// Load from config/.env (copy config/env.example to config/.env)
$envPath = __DIR__ . '/.env';
if (file_exists($envPath) && is_readable($envPath)) {
  $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  foreach ($lines as $line) {
    if (strpos(trim($line), '#') === 0) continue;
    if (strpos($line, '=') !== false) {
      list($key, $value) = explode('=', $line, 2);
      $key = trim($key);
      $value = trim($value, " \t\n\r\0\x0B\"'");
      if ($key !== '' && array_key_exists($key, $config)) {
        $config[$key] = $value;
      }
    }
  }
}

// Helper to get config value
function config($key, $default = '') {
  global $config;
  return $config[$key] ?? $default;
}
