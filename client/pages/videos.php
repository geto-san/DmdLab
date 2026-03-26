<?php
/**
 * Videos Page — ML in QC YouTube Channel
 * Weekly uploads on AI topics
 */
$youtubeUrl = function_exists('config') ? config('YOUTUBE_URL', 'https://www.youtube.com/@MLinQC') : 'https://www.youtube.com/@MLinQC';
?>

<div class="page videos-page">
  <div class="container">
    <header class="page-header">
      <h1>ML in QC</h1>
      <p class="page-subtitle">Weekly content on AI and machine learning. Subscribe for new uploads.</p>
    </header>

    <div class="videos-cta">
      <a href="<?php echo htmlspecialchars($youtubeUrl); ?>" target="_blank" rel="noopener noreferrer" class="videos-cta-btn">
        Watch on YouTube →
      </a>
    </div>

    <section class="videos-placeholder">
      <p class="text-secondary">Latest sessions and research webinars. Visit our channel for the full library.</p>
    </section>
  </div>
</div>
