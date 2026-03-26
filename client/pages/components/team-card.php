<?php
$name = $person['name'] ?? '';
$role = $person['role'] ?? '';
$bio = $person['bio'] ?? '';
$image = $person['image'] ?? '/DmdLab/client/assets/logo-7402580_1920.png';
$links = $person['links'] ?? [];
$projects = $person['projects'] ?? [];
?>
<article class="team-card">
  <div class="team-card-inner">
    <div class="team-card-image">
      <img src="<?php echo htmlspecialchars($image); ?>" alt="<?php echo htmlspecialchars($name); ?>">
    </div>
    <div class="team-card-body">
      <h3 class="team-card-name"><?php echo htmlspecialchars($name); ?></h3>
      <p class="team-card-role"><?php echo htmlspecialchars($role); ?></p>
      <?php if ($bio): ?>
      <p class="team-card-bio"><?php echo htmlspecialchars($bio); ?></p>
      <?php endif; ?>
      <?php if (!empty($links)): ?>
      <div class="team-card-links">
        <?php if (!empty($links['email'])): ?>
        <a href="mailto:<?php echo htmlspecialchars($links['email']); ?>" aria-label="Email">✉</a>
        <?php endif; ?>
        <?php if (!empty($links['github'])): ?>
        <a href="<?php echo htmlspecialchars($links['github']); ?>" target="_blank" rel="noopener" aria-label="GitHub">GitHub</a>
        <?php endif; ?>
        <?php if (!empty($links['linkedin'])): ?>
        <a href="<?php echo htmlspecialchars($links['linkedin']); ?>" target="_blank" rel="noopener" aria-label="LinkedIn">LinkedIn</a>
        <?php endif; ?>
        <?php if (!empty($links['google_scholar'])): ?>
        <a href="<?php echo htmlspecialchars($links['google_scholar']); ?>" target="_blank" rel="noopener" aria-label="Google Scholar">Scholar</a>
        <?php endif; ?>
      </div>
      <?php endif; ?>
    </div>
  </div>
</article>
