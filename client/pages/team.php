<?php
/**
 * Team Page - Professor, Members, Alumni
 * Portfolio-style layout inspired by tomshaw.dev
 */
$teamData = require __DIR__ . '/../../config/team-data.php';
$professors = $teamData['professor'] ?? [];
$members = $teamData['members'] ?? [];
$alumni = $teamData['alumni'] ?? [];
?>

<div class="page team-page">
  <div class="container container-narrow">
    <header class="page-header">
      <h1>Team</h1>
      <p class="page-subtitle">People behind DMRLab research and the ML in QC channel</p>
    </header>

    <?php if (!empty($professors)): ?>
    <section class="team-section" id="professor">
      <h2 class="team-section-title">Professor</h2>
      <div class="team-grid">
        <?php foreach ($professors as $person): ?>
        <?php include __DIR__ . '/components/team-card.php'; ?>
        <?php endforeach; ?>
      </div>
    </section>
    <?php endif; ?>

    <?php if (!empty($members)): ?>
    <section class="team-section" id="members">
      <h2 class="team-section-title">Members</h2>
      <div class="team-grid">
        <?php foreach ($members as $person): ?>
        <?php include __DIR__ . '/components/team-card.php'; ?>
        <?php endforeach; ?>
      </div>
    </section>
    <?php endif; ?>

    <?php if (!empty($alumni)): ?>
    <section class="team-section" id="alumni">
      <h2 class="team-section-title">Alumni</h2>
      <div class="team-grid">
        <?php foreach ($alumni as $person): ?>
        <?php include __DIR__ . '/components/team-card.php'; ?>
        <?php endforeach; ?>
      </div>
    </section>
    <?php else: ?>
    <section class="team-section" id="alumni">
      <h2 class="team-section-title">Alumni</h2>
      <p class="team-empty">No alumni yet — we're just getting started.</p>
    </section>
    <?php endif; ?>
  </div>
</div>
