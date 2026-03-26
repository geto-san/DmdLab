<?php
/**
 * Bootstrap - load config and set page
 */
require_once __DIR__ . '/../../config/config.php';

$allowedPages = ['lobby', 'articles', 'videos', 'projects', 'events', 'team'];
$page = $_GET['page'] ?? 'lobby';
if (!in_array($page, $allowedPages)) {
  $page = 'lobby';
}

$isFragmentRequest = isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
  strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
