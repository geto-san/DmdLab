<?php
$currentPage = $page ?? $_GET['page'] ?? 'lobby';
$baseUrl = 'index.php';
?>
<a href="<?php echo $baseUrl; ?>" class="nav-link<?php echo $currentPage === 'lobby' ? ' active' : ''; ?>" data-page="lobby">D-Lab</a>
<a href="<?php echo $baseUrl; ?>?page=discussions" class="nav-link<?php echo $currentPage === 'discussions' ? ' active' : ''; ?>" data-page="discussions">Discussions</a>
<a href="<?php echo $baseUrl; ?>?page=projects" class="nav-link<?php echo $currentPage === 'projects' ? ' active' : ''; ?>" data-page="projects">Projects</a>

<div class="nav-dropdown">
  <a href="<?php echo $baseUrl; ?>?page=team" class="nav-link nav-dropdown-trigger<?php echo $currentPage === 'team' ? ' active' : ''; ?>" data-page="team" aria-expanded="false" aria-haspopup="true" id="teamDropdownBtn">
    Team
    <svg class="nav-dropdown-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M3 4.5L6 7.5L9 4.5"/>
    </svg>
  </a>
  <div class="nav-dropdown-menu" id="teamDropdownMenu" aria-labelledby="teamDropdownBtn">
    <a href="<?php echo $baseUrl; ?>?page=team#professor" class="nav-dropdown-item">Professor</a>
    <a href="<?php echo $baseUrl; ?>?page=team#members" class="nav-dropdown-item">Members</a>
    <a href="<?php echo $baseUrl; ?>?page=team#alumni" class="nav-dropdown-item">Alumni</a>
  </div>
</div>
