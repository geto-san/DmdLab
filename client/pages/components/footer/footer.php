<?php
/**
 * Site Footer
 * Main footer component with modular sections
 */
?>

<footer class="site-footer">
  <div class="footer-container">

    <!-- Main Footer Content -->
    <div class="footer-grid">
      
      <!-- About Section -->
      <?php include __DIR__ . '/footer-about.php'; ?>

      <!-- Research Areas Section -->
      <?php include __DIR__ . '/footer-research.php'; ?>

      <!-- Contact Section -->
      <?php include __DIR__ . '/footer-contact.php'; ?>

    </div>

    <!-- Bottom Bar -->
    <?php include __DIR__ . '/footer-bottom.php'; ?>

  </div>
</footer>

<!-- Footer JavaScript -->
<script src="pages/components/footer/footer.js" defer></script>