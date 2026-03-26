<?php
/**
 * Footer About Section
 * Uses config for branding
 */
$appName = function_exists('config') ? config('APP_NAME', 'DMRLab') : 'DMRLab';
$appDesc = function_exists('config') ? config('APP_DESCRIPTION', 'Advancing AI research') : 'Advancing AI research';
?>

<div class="footer-section footer-about">
  <div class="footer-about-header">
    <img src="assets/logo-7402580_1920.png" alt="<?php echo htmlspecialchars($appName); ?> Logo" class="footer-logo" />
    <div class="footer-about-brand">
      <h3 class="footer-brand-title"><?php echo htmlspecialchars($appName); ?></h3>
      <p class="footer-brand-subtitle">Research & Innovation</p>
    </div>
  </div>
  
  <p class="footer-description">
    <?php echo htmlspecialchars($appDesc); ?>. ML in QC YouTube channel. Projects and events.
  </p>
  
  <div class="footer-status">
    <span class="status-indicator"></span>
    <span class="status-text">Active</span>
  </div>
</div>