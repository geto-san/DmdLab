<?php
/**
 * D-Lab Page — Main landing
 * Layout strictly based on tomshaw.dev: hero, sections, clean structure
 */
$youtubeUrl = function_exists('config') ? config('YOUTUBE_URL', 'https://www.youtube.com/@MLinQC') : 'https://www.youtube.com/@MLinQC';
?>

<div class="page dlab-page">
  <div class="container">

    <!-- Hero (tomshaw.dev style) -->
    <section class="dlab-hero" id="hero">
      <h1>D-Lab</h1>
      <p class="dlab-tagline">Deepminds Research Lab — advancing AI research through collaboration and innovation.</p>
      <p class="dlab-mission">Inspiring you to build with tech. We share insights into AI and ML from a builders perspective.</p>
      <div class="dlab-hero-ctas">
        <a href="index.php?page=discussions" class="dlab-cta">Watch on YouTube →</a>
        <a href="index.php?page=projects" class="dlab-cta-secondary">Projects →</a>
      </div>
    </section>

    <!-- Articles -->
    <section class="dlab-section" id="articles">
      <h2>Articles</h2>
      <p class="section-desc">Research articles, papers, and technical documentation.</p>
      <div class="dlab-articles-grid">
        <article class="dlab-card">
          <h4>Research & Insights</h4>
          <p>Explore our latest research and technical documentation. Content updated regularly.</p>
        </article>
        <article class="dlab-card">
          <h4>Build Notes</h4>
          <p>Technical notes and tutorials from our projects and experiments.</p>
        </article>
      </div>
    </section>

    <!-- Events -->
    <section class="dlab-section" id="events">
      <h2>Events</h2>
      <p class="section-desc">Workshops, talks, and events we participate in.</p>
      <div class="dlab-events-grid">
        <article class="dlab-card dlab-event-card">
          <h4>Weekly Sessions</h4>
          <p>Join our weekly YouTube uploads on ML in QC — new content every week on AI and quantum computing topics.</p>
          <a href="index.php?page=discussions" class="link-arrow">View Sessions →</a>
        </article>
        <article class="dlab-card dlab-event-card">
          <h4>University Events</h4>
          <p>We participate in campus workshops, hackathons, and research showcases.</p>
        </article>
        <article class="dlab-card dlab-event-card">
          <h4>Collaborations</h4>
          <p>Engaging with industry and academic partners on joint initiatives.</p>
        </article>
      </div>
    </section>

    <!-- Recents / Updates strip -->
    <aside class="dlab-updates">
      <?php include __DIR__ . '/components/update-strip/update-strip.php'; ?>
    </aside>

  </div>
</div>
