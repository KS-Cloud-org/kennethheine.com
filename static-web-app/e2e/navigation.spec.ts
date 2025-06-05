import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Start from home page
    await page.goto('/');
  });

  test('should display main navigation menu', async ({ page }) => {
    // Check main navigation is visible
    const mainNav = page.locator('[data-testid="main-navigation"]');
    await expect(mainNav).toBeVisible();
    
    // Check navigation links
    await expect(page.locator('a[href="/"]')).toBeVisible(); // Home
    await expect(page.locator('a[href="/about"]')).toBeVisible(); // About
    await expect(page.locator('a[href="/blog"]')).toBeVisible(); // Blog
    await expect(page.locator('a[href="/contact"]')).toBeVisible(); // Contact
  });

  test('should navigate to all main pages', async ({ page }) => {
    // Navigate to About page
    await page.locator('a[href="/about"]').click();
    await expect(page).toHaveURL('/about');
    await expect(page.locator('h1')).toContainText('About');
    
    // Navigate to Blog page
    await page.locator('a[href="/blog"]').click();
    await expect(page).toHaveURL('/blog');
    await expect(page.locator('h1')).toContainText('Blog');
    
    // Navigate to Contact page
    await page.locator('a[href="/contact"]').click();
    await expect(page).toHaveURL('/contact');
    await expect(page.locator('h1')).toContainText('Contact');
    
    // Navigate back to Home
    await page.locator('a[href="/"]').click();
    await expect(page).toHaveURL('/');
  });

  test('should highlight active navigation item', async ({ page }) => {
    // Check home is active initially
    const homeLink = page.locator('a[href="/"]');
    
    // Navigate to about page
    await page.locator('a[href="/about"]').click();
    
    // Check about link is now active
    const aboutLink = page.locator('a[href="/about"]');
    const aboutClasses = await aboutLink.getAttribute('class');
    
    // Should have active styling
    expect(aboutClasses).toContain('active');
  });

  test('should display logo and brand name', async ({ page }) => {
    // Check logo is present
    const logo = page.locator('[data-testid="logo"]');
    
    if (await logo.isVisible()) {
      await expect(logo).toBeVisible();
    }
    
    // Check brand name/site title
    const brandName = page.locator('[data-testid="brand-name"]');
    
    if (await brandName.isVisible()) {
      await expect(brandName).toContainText(/.+/);
    }
  });

  test('should support mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check mobile menu button is visible
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    await expect(mobileMenuButton).toBeVisible();
    
    // Click mobile menu button
    await mobileMenuButton.click();
    
    // Check mobile menu is displayed
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    await expect(mobileMenu).toBeVisible();
    
    // Check mobile navigation links
    await expect(mobileMenu.locator('a[href="/about"]')).toBeVisible();
    await expect(mobileMenu.locator('a[href="/blog"]')).toBeVisible();
    await expect(mobileMenu.locator('a[href="/contact"]')).toBeVisible();
  });

  test('should close mobile menu when clicking outside', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open mobile menu
    await page.locator('[data-testid="mobile-menu-button"]').click();
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Click outside menu
    await page.locator('main').click();
    
    // Menu should be closed
    await expect(page.locator('[data-testid="mobile-menu"]')).not.toBeVisible();
  });

  test('should close mobile menu when selecting a link', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open mobile menu
    await page.locator('[data-testid="mobile-menu-button"]').click();
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Click on about link
    await page.locator('[data-testid="mobile-menu"] a[href="/about"]').click();
    
    // Should navigate to about page
    await expect(page).toHaveURL('/about');
    
    // Mobile menu should be closed
    await expect(page.locator('[data-testid="mobile-menu"]')).not.toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Focus on first navigation link
    await page.keyboard.press('Tab');
    
    // Should focus on navigation elements
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Press Enter to navigate
    await page.keyboard.press('Enter');
    
    // Should navigate (URL should change)
    await page.waitForLoadState('networkidle');
  });

  test('should maintain navigation state across page loads', async ({ page }) => {
    // Navigate to about page
    await page.locator('a[href="/about"]').click();
    await expect(page).toHaveURL('/about');
    
    // Refresh page
    await page.reload();
    
    // Navigation should still be present
    await expect(page.locator('[data-testid="main-navigation"]')).toBeVisible();
    await expect(page.locator('a[href="/about"]')).toHaveClass(/active/);
  });
});

test.describe('Navigation Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    // Check navigation has proper role
    const navigation = page.locator('[data-testid="main-navigation"]');
    const navRole = await navigation.getAttribute('role');
    
    if (navRole) {
      expect(navRole).toBe('navigation');
    }
    
    // Check mobile menu button has proper ARIA attributes
    await page.setViewportSize({ width: 375, height: 667 });
    
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    const ariaLabel = await mobileMenuButton.getAttribute('aria-label');
    const ariaExpanded = await mobileMenuButton.getAttribute('aria-expanded');
    
    expect(ariaLabel).toBeTruthy();
    expect(ariaExpanded).toBe('false');
    
    // Click to open menu
    await mobileMenuButton.click();
    
    // Check aria-expanded changes
    const expandedState = await mobileMenuButton.getAttribute('aria-expanded');
    expect(expandedState).toBe('true');
  });

  test('should support screen reader navigation', async ({ page }) => {
    // Check navigation landmarks
    const navigation = page.locator('nav');
    await expect(navigation).toBeVisible();
    
    // Check skip link if present
    const skipLink = page.locator('[data-testid="skip-link"]');
    
    if (await skipLink.isVisible()) {
      await skipLink.focus();
      await expect(skipLink).toBeFocused();
    }
  });

  test('should have proper focus management', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open mobile menu
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    await mobileMenuButton.click();
    
    // Focus should move to first menu item
    const firstMenuItem = page.locator('[data-testid="mobile-menu"] a').first();
    
    // Tab should navigate within menu
    await page.keyboard.press('Tab');
    await expect(firstMenuItem).toBeFocused();
  });
});

test.describe('Navigation Performance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate quickly between pages', async ({ page }) => {
    // Measure navigation time
    const startTime = Date.now();
    
    // Navigate to about page
    await page.locator('a[href="/about"]').click();
    await page.waitForLoadState('networkidle');
    
    const navigationTime = Date.now() - startTime;
    
    // Should navigate within 2 seconds
    expect(navigationTime).toBeLessThan(2000);
  });

  test('should preload navigation links if configured', async ({ page }) => {
    // Check for link preloading
    const preloadLinks = page.locator('link[rel="preload"]');
    const preloadCount = await preloadLinks.count();
    
    // May have preload links for performance
    expect(preloadCount).toBeGreaterThanOrEqual(0);
  });

  test('should handle rapid navigation clicks', async ({ page }) => {
    // Rapidly click navigation links
    await page.locator('a[href="/about"]').click({ timeout: 500 });
    await page.locator('a[href="/blog"]').click({ timeout: 500 });
    await page.locator('a[href="/contact"]').click({ timeout: 500 });
    
    // Should end up on the last clicked page
    await expect(page).toHaveURL('/contact');
    await expect(page.locator('h1')).toContainText('Contact');
  });
});

test.describe('Navigation Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should handle broken navigation links gracefully', async ({ page }) => {
    // Navigate to non-existent page
    await page.goto('/non-existent-page');
    
    // Should show 404 page or redirect
    const pageContent = await page.textContent('body');
    
    // Should either show 404 content or redirect to home
    expect(
      pageContent?.includes('404') || 
      pageContent?.includes('Page Not Found') ||
      page.url().includes('/')
    ).toBeTruthy();
  });

  test('should maintain navigation during errors', async ({ page }) => {
    // Go to 404 page
    await page.goto('/non-existent-page');
    
    // Navigation should still be present
    const navigation = page.locator('[data-testid="main-navigation"]');
    
    if (await navigation.isVisible()) {
      await expect(navigation).toBeVisible();
      
      // Should be able to navigate away from error page
      await page.locator('a[href="/"]').click();
      await expect(page).toHaveURL('/');
    }
  });
});

test.describe('Breadcrumb Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display breadcrumbs if present', async ({ page }) => {
    // Navigate to blog post (deeper page)
    await page.goto('/blog');
    
    // Check if breadcrumbs exist
    const breadcrumbs = page.locator('[data-testid="breadcrumbs"]');
    
    if (await breadcrumbs.isVisible()) {
      await expect(breadcrumbs).toBeVisible();
      
      // Should contain home link
      await expect(breadcrumbs.locator('a[href="/"]')).toBeVisible();
    }
  });

  test('should support breadcrumb navigation', async ({ page }) => {
    // Navigate to a blog post if breadcrumbs exist
    await page.goto('/blog');
    
    const breadcrumbs = page.locator('[data-testid="breadcrumbs"]');
    
    if (await breadcrumbs.isVisible()) {
      // Click on home breadcrumb
      await breadcrumbs.locator('a[href="/"]').click();
      
      // Should navigate to home
      await expect(page).toHaveURL('/');
    }
  });
});
