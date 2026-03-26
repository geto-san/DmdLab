<?php
/**
 * Discussions Page — ML in QC videos & sessions
 * Layout inspired by tomshaw.dev
 */
$youtubeUrl = function_exists('config') ? config('YOUTUBE_URL', 'https://www.youtube.com/@MLinQC') : 'https://www.youtube.com/@MLinQC';
?>

<div class="page discussions-page">
  <div class="container container-narrow">

    <header class="page-header discussions-hero">
      <h1>Discussions</h1>
      <p class="page-subtitle">Weekly content on AI and machine learning. ML in QC channel — new uploads every week on research topics.</p>
      <a href="<?php echo htmlspecialchars($youtubeUrl); ?>" target="_blank" rel="noopener noreferrer" class="dlab-cta">Watch on YouTube →</a>
    </header>

    <section class="discussions-content">
      <p class="text-secondary">Latest sessions and research webinars. Visit our channel for the full library of discussions on AI, quantum computing, and related topics.</p>
    </section>

  </div>
</div>
