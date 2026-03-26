<?php
/**
 * Update Strip (Announcements)
 * Client-side fetch driven
 */
?>

<section class="section">
  <div class="update-strip surface">
    
    <!-- Header -->
    <div class="update-strip-header">
      <div class="update-strip-title">
        <img class="icon bell" src="assets/recent-svgrepo-com.svg" alt="">
        <h3>Recents</h3>
      </div>

      <a href="index.php?page=discussions" class="view-all-btn" role="button">
        View All
        <img class="icon chevron" src="assets/arrow-narrow-circle-broken-down-svgrepo-com.svg" alt="">
      </a>
    </div>

    <!-- Body -->
    <div class="update-strip-body" id="announcementBody">
      <div class="update-loading">Loading…</div>
    </div>

  </div>
</section>

<script src="update-strip.js" defer></script>
