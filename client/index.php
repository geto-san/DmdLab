<?php
/**
 * Application Entry Point
 * Single entry with page routing (SPA-like fragment support)
 */
require_once __DIR__ . '/../config/config.php';

$allowedPages = ['lobby', 'discussions', 'projects', 'team'];
$page = $_GET['page'] ?? 'lobby';
if (!in_array($page, $allowedPages)) {
  $page = 'lobby';
}

$isFragmentRequest = isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
  strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

// Fragment request: return only #app content
if ($isFragmentRequest) {
  $pageFile = __DIR__ . '/pages/' . $page . '.php';
  if (file_exists($pageFile)) {
    ob_start();
    include $pageFile;
    $content = ob_get_clean();
    echo '<main id="app">' . $content . '</main>';
  } else {
    echo '<main id="app"><div class="container"><p>Page not found.</p></div></main>';
  }
  exit;
}

// Full page request
$pageTitles = [
  'lobby' => 'D-Lab',
  'discussions' => 'Discussions',
  'projects' => 'Projects',
  'team' => 'Team',
];
$pageTitle = $pageTitles[$page] ?? 'DMRLab';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><?php echo htmlspecialchars($pageTitle); ?> — DeepsMinds Research Lab (DMRLab)</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="DeepsMinds Research Lab — advancing AI and ML research. ML in QC YouTube channel. University research club.">
  <link rel="stylesheet" href="assets/global.css?v=<?php echo time(); ?>">
  <link rel="stylesheet" href="pages/components/header/header.css?v=<?php echo time(); ?>">
  <link rel="stylesheet" href="pages/components/quick-navigation/quick-navigation.css">
  <link rel="stylesheet" href="pages/components/update-strip/update-strip.css?v=<?php echo time(); ?>">
  <link rel="stylesheet" href="pages/components/footer/footer.css?v=<?php echo time(); ?>">
  <link rel="stylesheet" href="pages/pages.css?v=<?php echo time(); ?>">
  <link rel="shortcut icon" href="assets/logo-7402580_1920.png" type="image/x-icon">
  <script>
    (function(){
      var k='dlab-theme',t=localStorage.getItem(k);
      if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}
      document.documentElement.setAttribute('data-theme',t);
    })();
  </script>
</head>
<body>
  <?php include __DIR__ . '/pages/components/header/header.php'; ?>

  <main id="app" data-page="<?php echo htmlspecialchars($page); ?>">
    <?php
    $pageFile = __DIR__ . '/pages/' . $page . '.php';
    if (file_exists($pageFile)) {
      include $pageFile;
    } else {
      echo '<div class="container"><p>Page not found.</p></div>';
    }
    ?>
  </main>

  <?php include __DIR__ . '/pages/components/footer/footer.php'; ?>

  <script>window.API_BASE_URL = <?php echo json_encode(function_exists('config') ? config('API_BASE_URL') : ''); ?>;</script>
  <script src="pages/components/header/header.js" defer></script>
  <script src="pages/components/footer/footer.js" defer></script>
  <script src="pages/components/router.js" defer></script>
</body>
</html>
