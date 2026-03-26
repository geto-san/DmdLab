# UI/UX Component Reference Guide

## Quick Navigation

### Using Data Attributes for Routing
All navigation links should use the `data-page` attribute for client-side routing:

```html
<!-- Correct -->
<a href="#" data-page="articles">Articles</a>
<a href="#" data-page="videos">Video</a>
<a href="index.php" data-page="lobby">Lobby</a>

<!-- The router.js will handle these automatically -->
```

### Adding New Pages

1. Create a new PHP file in `/client/pages/`:
```php
<?php
/**
 * Page Title
 * Description
 */
?>
<div class="container">
  <section class="section">
    <!-- Your content here -->
  </section>
</div>
```

2. Update the router configuration in `/client/pages/components/router.js` if needed

3. Add link in header navigation (`/client/pages/components/header/nav-links.php`)

---

## Styling Guide

### Using Utility Classes

#### Spacing
```html
<!-- Padding -->
<div class="p-4">Padded content</div>
<div class="px-4 py-2">Horizontal padding 4, vertical padding 2</div>

<!-- Margin -->
<div class="mb-4">Margin bottom 4</div>
<div class="mx-auto">Centered horizontally</div>
```

#### Typography
```html
<h1>Heading 1 (font-size: 2.25rem)</h1>
<p class="text-secondary">Secondary text color</p>
<p class="text-sm">Smaller text</p>
<a class="font-semibold">Bold link</a>
```

#### Colors
```html
<!-- Text Colors -->
<p class="text-primary">Dark gray #1f2937</p>
<p class="text-secondary">Medium gray #6b7280</p>
<p class="text-muted">Light gray #9ca3af</p>

<!-- Background Colors -->
<div class="bg-primary">White background</div>
<div class="bg-secondary">Light gray background</div>
```

#### Layout
```html
<!-- Flexbox -->
<div class="flex items-center justify-between">
  <span>Left content</span>
  <span>Right content</span>
</div>

<!-- Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

#### Responsive Classes
```html
<!-- Hidden on desktop, shown on mobile -->
<div class="md:hidden">Mobile only content</div>

<!-- Hidden on mobile, shown on desktop -->
<div class="md:flex">Desktop content</div>

<!-- Grid responsive -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

#### Interactions
```html
<!-- Hover effects -->
<div class="transition-base hover:shadow-md">
  Content with shadow on hover
</div>

<!-- Buttons -->
<button class="transition-fast hover:bg-primary rounded">
  Click me
</button>
```

---

## Component Structure

### Header Component
Located in: `/client/pages/components/header/`

Files:
- `header.php` - Main header markup
- `header.css` - All header styles
- `header.js` - Interactive features (ripple effect, mobile menu)
- `nav-links.php` - Navigation links (shared between desktop & mobile)

**Usage:**
```php
<?php include __DIR__ . '/pages/components/header/header.php'; ?>
```

---

### Footer Component
Located in: `/client/pages/components/footer/`

Files:
- `footer.php` - Main footer container
- `footer-about.php` - About section with logo and status
- `footer-research.php` - Research areas section
- `footer-contact.php` - Contact information
- `footer-bottom.php` - Copyright and version info
- `footer.css` - All footer styles
- `footer.js` - Interactive features (hover effects)

**Usage:**
```php
<?php include __DIR__ . '/pages/components/footer/footer.php'; ?>
```

**Customization:**
Edit these files to add/remove content:
- Modify `footer-about.php` for company description
- Update `footer-research.php` for research areas
- Edit `footer-contact.php` for contact details
- Change `footer-bottom.php` for copyright info

---

## Global Styles

### CSS Variables (Custom Properties)
All colors, spacing, and sizing use CSS variables defined in:
`/client/assets/global.css`

**Common Variables:**
```css
/* Colors */
--accent: #0b74de
--text-primary: #1f2937
--text-secondary: #6b7280
--bg-primary: #ffffff
--bg-secondary: #f9fafb

/* Spacing */
--spacing-xs: 0.25rem
--spacing-sm: 0.5rem
--spacing-md: 1rem
--spacing-lg: 1.5rem
--spacing-xl: 2rem

/* Typography */
--font-size-sm: 0.875rem
--font-size-md: 1rem
--font-size-lg: 1.125rem
--font-weight-normal: 400
--font-weight-semibold: 600
--font-weight-bold: 700
```

---

## JavaScript Modules

### Header Module (`header.js`)
Handles:
- Ripple effect on clicks
- Mobile menu toggle
- Menu close on outside click
- DOM change observation

**Configuration:**
```javascript
const CONFIG = {
  selectors: {
    rippleTarget: '.nav-link, .brand-link',
    mobileToggle: '#mobileMenuToggle',
    mobileNav: '#mobileNav',
    mobileNavLinks: '.mobile-nav .nav-link'
  },
  rippleDuration: 600
};
```

### Footer Module (`footer.js`)
Handles:
- Social link hover effects
- Contact link tracking
- Smooth scrolling
- Lazy loading (if needed)
- Accessibility enhancements

---

## Responsive Breakpoints

```css
/* Mobile First */
0px - 640px     /* Small mobile */
640px - 768px   /* Mobile */
768px - 1024px  /* Tablet */
1024px+         /* Desktop */
```

**Using in CSS:**
```css
@media (max-width: 768px) {
  /* Tablet and below */
}

@media (min-width: 768px) {
  /* Tablet and above */
}

@media (min-width: 1024px) {
  /* Desktop and above */
}
```

---

## Adding Server Communication

### Placeholder Pattern
```php
<?php
/**
 * SERVER PLACEHOLDER
 * ENDPOINT: /api/articles
 * METHOD: GET
 * RESPONSE: { articles: [...] }
 */

// TODO: Replace with actual fetch when backend is ready
$articles = []; // Placeholder data
?>
```

### JavaScript Fetch Example
```javascript
// Fetch articles from server
async function fetchArticles() {
  try {
    const response = await fetch('/DmdLab/server/api/articles', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}
```

---

## Common Issues & Solutions

### Issue: Styles not updating
**Solution:** Clear browser cache or add cache-busting parameter:
```php
<link rel="stylesheet" href="assets/global.css?v=<?php echo time(); ?>">
```

### Issue: Mobile menu not closing
**Solution:** Ensure mobile menu links have the `.nav-link` class:
```html
<a href="#" class="nav-link" data-page="articles">Articles</a>
```

### Issue: Ripple effect not showing
**Solution:** Make sure the element has `overflow: hidden` and is positioned relatively:
```css
.nav-link {
  position: relative;
  overflow: hidden;
}
```

### Issue: Footer not sticking to bottom on short pages
**Solution:** This is handled by the flexbox layout in body:
```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
main {
  flex: 1 0 auto;
}
```

---

## Browser DevTools Tips

### Testing Responsive Design
1. Open DevTools (F12 or Ctrl+Shift+I)
2. Click device toggle (Ctrl+Shift+M)
3. Select different device presets
4. Check at these widths: 360px, 480px, 768px, 1024px

### Checking Accessibility
1. Go to Accessibility tab in DevTools
2. Check for contrast issues
3. Verify keyboard navigation works
4. Test with screen readers

### Performance
1. Lighthouse tab shows performance metrics
2. Network tab shows loading times
3. Look for unused CSS and JS

---

## Development Workflow

1. **Local Testing:**
   ```bash
   php -S localhost:8000
   # Navigate to http://localhost:8000/DmdLab/client/
   ```

2. **Make Changes:**
   - Edit component files
   - Update CSS as needed
   - Test in browser

3. **Test Responsive Design:**
   - Use DevTools device emulation
   - Test at all breakpoints
   - Check touch interactions on mobile

4. **Commit Changes:**
   - Include descriptive commit messages
   - Reference which components were modified

---

## Resources

- [CSS Variables Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Responsive Design Patterns](https://www.smashingmagazine.com/guides/responsive-web-design/)

---

## Support & Questions

For questions about the component structure or styling, refer back to:
- Component files in `/client/pages/components/`
- Global styles in `/client/assets/global.css`
- This reference guide

---

**Last Updated:** January 27, 2026
**Version:** 1.0.0
