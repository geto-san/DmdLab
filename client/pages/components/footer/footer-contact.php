<?php
/**
 * Footer Contact Section
 * Uses config for contact details and social links
 */
$contactEmail = function_exists('config') ? config('CONTACT_EMAIL', 'kimrichies@gmail.com') : 'kimrichies@gmail.com';
$contactPhone = function_exists('config') ? config('CONTACT_PHONE', '+256 774 437989') : '+256 774 437989';
$contactLocation = function_exists('config') ? config('CONTACT_LOCATION', 'MUST, Kihumuro Campus') : 'MUST, Kihumuro Campus';
$githubUrl = function_exists('config') ? config('GITHUB_URL', 'https://github.com/') : 'https://github.com/';
$youtubeUrl = function_exists('config') ? config('YOUTUBE_URL', 'https://www.youtube.com/@MLinQC') : 'https://www.youtube.com/@MLinQC';
?>

<div class="footer-section">
  <h4 class="footer-section-title">Contact</h4>
  
  <div class="footer-contact-list">
    <div class="footer-contact-item">
      <svg class="footer-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
      </svg>
      <div class="footer-contact-info">
        <a href="mailto:<?php echo htmlspecialchars($contactEmail); ?>" class="footer-contact-link"><?php echo htmlspecialchars($contactEmail); ?></a>
        <div class="footer-contact-label">Lab contact</div>
      </div>
    </div>
    
    <div class="footer-contact-item">
      <svg class="footer-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
      </svg>
      <div class="footer-contact-info">
        <a href="tel:<?php echo preg_replace('/\s+/', '', $contactPhone); ?>" class="footer-contact-link"><?php echo htmlspecialchars($contactPhone); ?></a>
        <div class="footer-contact-label">Lab contact</div>
      </div>
    </div>
    
    <div class="footer-contact-item">
      <svg class="footer-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
      <div class="footer-contact-info">
        <div class="footer-contact-link"><?php echo htmlspecialchars(explode(',', $contactLocation)[0]); ?></div>
        <div class="footer-contact-label"><?php echo htmlspecialchars(trim(explode(',', $contactLocation)[1] ?? $contactLocation)); ?></div>
      </div>
    </div>
  </div>
  
  <div class="footer-social-links">
    <a href="<?php echo htmlspecialchars($youtubeUrl); ?>" class="footer-social-link" aria-label="YouTube - ML in QC" target="_blank" rel="noopener noreferrer" title="ML in QC Channel">
      <svg class="footer-social-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
    </a>
    <a href="<?php echo htmlspecialchars($githubUrl); ?>" class="footer-social-link" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
      <svg class="footer-social-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
    </a>
    <a href="mailto:<?php echo htmlspecialchars($contactEmail); ?>" class="footer-social-link" aria-label="Email">
      <svg class="footer-social-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
    </a>
  </div>
</div>