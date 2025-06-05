import { expect, test } from '@playwright/test';

test.describe('Blog Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to blog page
    await page.goto('/blog');
  });

  test('should display blog page with proper structure', async ({ page }) => {
    // Check page title and meta
    await expect(page).toHaveTitle(/Blog/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Blog');
    
    // Check that blog posts are displayed
    const blogPosts = page.locator('[data-testid="blog-post"]');
    await expect(blogPosts).toHaveCount({ min: 1 });
  });

  test('should display blog post cards with proper content', async ({ page }) => {
    // Check blog post structure
    const firstPost = page.locator('[data-testid="blog-post"]').first();
    
    // Check post title
    await expect(firstPost.locator('h2')).toBeVisible();
    
    // Check post excerpt or description
    await expect(firstPost.locator('[data-testid="post-excerpt"]')).toBeVisible();
    
    // Check post date
    await expect(firstPost.locator('[data-testid="post-date"]')).toBeVisible();
    
    // Check read more link
    await expect(firstPost.locator('a')).toBeVisible();
  });

  test('should navigate to individual blog post', async ({ page }) => {
    // Click on first blog post
    const firstPostLink = page.locator('[data-testid="blog-post"] a').first();
    await firstPostLink.click();
    
    // Should navigate to blog post page
    await expect(page).toHaveURL(/\/blog\/.+/);
    
    // Should display blog post content
    await expect(page.locator('article')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display blog post content properly', async ({ page }) => {
    // Navigate to first blog post
    const firstPostLink = page.locator('[data-testid="blog-post"] a').first();
    await firstPostLink.click();
    
    // Check blog post structure
    await expect(page.locator('article')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    
    // Check post meta information
    await expect(page.locator('[data-testid="post-date"]')).toBeVisible();
    
    // Check post content
    await expect(page.locator('[data-testid="post-content"]')).toBeVisible();
    
    // Check back to blog link
    await expect(page.locator('a[href="/blog"]')).toBeVisible();
  });

  test('should support blog post navigation', async ({ page }) => {
    // Navigate to first blog post
    const firstPostLink = page.locator('[data-testid="blog-post"] a').first();
    await firstPostLink.click();
    
    // Click back to blog
    await page.locator('a[href="/blog"]').click();
    
    // Should be back on blog page
    await expect(page).toHaveURL('/blog');
    await expect(page.locator('h1')).toContainText('Blog');
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check mobile layout
    await expect(page.locator('h1')).toBeVisible();
    
    // Check blog posts stack properly on mobile
    const blogPosts = page.locator('[data-testid="blog-post"]');
    await expect(blogPosts.first()).toBeVisible();
    
    // Check mobile navigation
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    }
  });

  test('should support theme switching', async ({ page }) => {
    // Check initial theme
    const body = page.locator('body');
    
    // Find theme toggle button
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await expect(themeToggle).toBeVisible();
    
    // Click theme toggle
    await themeToggle.click();
    
    // Check theme changed (class should change)
    await expect(body).toHaveClass(/dark|light/);
  });

  test('should have proper SEO elements', async ({ page }) => {
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
    
    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /.+/);
    
    // Check structured data
    const structuredData = page.locator('script[type="application/ld+json"]');
    await expect(structuredData).toHaveCount({ min: 1 });
  });

  test('should have proper accessibility', async ({ page }) => {
    // Check heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    
    // Check alt text for images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute('alt');
    }
    
    // Check link accessibility
    const links = page.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < Math.min(linkCount, 5); i++) {
      const link = links.nth(i);
      const linkText = await link.textContent();
      expect(linkText?.trim()).toBeTruthy();
    }
  });

  test('should perform well', async ({ page }) => {
    // Start performance timing
    const startTime = Date.now();
    
    // Navigate to page
    await page.goto('/blog');
    
    // Wait for main content to load
    await page.waitForSelector('h1');
    
    // Check load time
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    
    // Check for performance issues
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait a bit to collect any errors
    await page.waitForTimeout(1000);
    
    // Should have no console errors
    expect(errors).toHaveLength(0);
  });
});

test.describe('Blog Post Search and Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('should support search functionality if available', async ({ page }) => {
    // Check if search input exists
    const searchInput = page.locator('[data-testid="blog-search"]');
    
    if (await searchInput.isVisible()) {
      // Test search functionality
      await searchInput.fill('test');
      await page.keyboard.press('Enter');
      
      // Check search results
      await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
    }
  });

  test('should support category filtering if available', async ({ page }) => {
    // Check if category filter exists
    const categoryFilter = page.locator('[data-testid="category-filter"]');
    
    if (await categoryFilter.isVisible()) {
      // Test category filtering
      await categoryFilter.click();
      
      // Check filtered results
      await expect(page.locator('[data-testid="blog-post"]')).toHaveCount({ min: 0 });
    }
  });

  test('should support tag filtering if available', async ({ page }) => {
    // Check if tag filter exists
    const tagFilter = page.locator('[data-testid="tag-filter"]');
    
    if (await tagFilter.isVisible()) {
      // Test tag filtering
      await tagFilter.first().click();
      
      // Check filtered results
      await expect(page.locator('[data-testid="blog-post"]')).toHaveCount({ min: 0 });
    }
  });
});

test.describe('Blog RSS and Sharing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('should have RSS feed link if available', async ({ page }) => {
    // Check for RSS link
    const rssLink = page.locator('link[type="application/rss+xml"]');
    
    if (await rssLink.count() > 0) {
      await expect(rssLink).toHaveAttribute('href', /.+/);
    }
  });

  test('should support social sharing if available', async ({ page }) => {
    // Navigate to first blog post
    const firstPostLink = page.locator('[data-testid="blog-post"] a').first();
    await firstPostLink.click();
    
    // Check for social sharing buttons
    const shareButtons = page.locator('[data-testid="share-button"]');
    
    if (await shareButtons.count() > 0) {
      await expect(shareButtons.first()).toBeVisible();
    }
  });
});
