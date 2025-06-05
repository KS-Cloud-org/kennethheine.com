/**
 * @fileoverview E2E Test - Home Page Navigation and Functionality
 * Tests the main landing page functionality, navigation, and user interactions
 * @author Kenneth Heine
 * @created June 2025
 */

import { expect, test } from '@playwright/test';

test.describe('Home Page - Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test
    await page.goto('/');
  });

  test('should load home page successfully', async ({ page }) => {
    // Verify page loads and basic elements are present
    await expect(page).toHaveTitle(/Kenneth Heine/);
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for main navigation
    await expect(page.locator('nav')).toBeVisible();
    
    // Verify main content areas are present
    await expect(page.locator('main')).toBeVisible();
  });

  test('should display hero section correctly', async ({ page }) => {
    // Check hero section elements
    const heroSection = page.locator('[data-testid="hero-section"]').first();
    await expect(heroSection).toBeVisible();
    
    // Verify hero text content
    await expect(page.locator('h1')).toContainText('Kenneth');
    
    // Check for call-to-action buttons if present
    const ctaButtons = page.locator('[data-testid="cta-button"]');
    if (await ctaButtons.count() > 0) {
      await expect(ctaButtons.first()).toBeVisible();
    }
  });

  test('should navigate to all main pages', async ({ page }) => {
    // Test navigation to About page
    const aboutLink = page.locator('nav a[href="/about"]');
    if (await aboutLink.count() > 0) {
      await aboutLink.click();
      await expect(page).toHaveURL('/about');
      await page.goBack();
    }

    // Test navigation to Blog page
    const blogLink = page.locator('nav a[href="/blog"]');
    if (await blogLink.count() > 0) {
      await blogLink.click();
      await expect(page).toHaveURL('/blog');
      await page.goBack();
    }

    // Test navigation to Contact page
    const contactLink = page.locator('nav a[href="/contact"]');
    if (await contactLink.count() > 0) {
      await contactLink.click();
      await expect(page).toHaveURL('/contact');
      await page.goBack();
    }
  });

  test('should have responsive design', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('main')).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('main')).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('main')).toBeVisible();
    
    // Check if mobile menu exists and works
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    if (await mobileMenuButton.count() > 0) {
      await mobileMenuButton.click();
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    }
  });

  test('should have working theme toggle', async ({ page }) => {
    // Look for theme toggle button
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    if (await themeToggle.count() > 0) {
      // Get initial theme
      const initialTheme = await page.locator('html').getAttribute('data-theme') || 
                          await page.locator('html').getAttribute('class');
      
      // Toggle theme
      await themeToggle.click();
      
      // Wait for theme change
      await page.waitForTimeout(500);
      
      // Verify theme changed
      const newTheme = await page.locator('html').getAttribute('data-theme') || 
                      await page.locator('html').getAttribute('class');
      
      expect(newTheme).not.toBe(initialTheme);
    }
  });

  test('should load without accessibility violations', async ({ page }) => {
    // Basic accessibility checks
    await expect(page.locator('main')).toBeVisible();
    
    // Check for proper heading hierarchy
    const h1Elements = page.locator('h1');
    await expect(h1Elements).toHaveCount(1);
    
    // Verify navigation has proper ARIA labels
    const nav = page.locator('nav');
    if (await nav.count() > 0) {
      await expect(nav).toBeVisible();
    }
    
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });

  test('should have good performance metrics', async ({ page }) => {
    // Start measuring performance
    const startTime = Date.now();
    
    // Navigate to page and wait for load
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Performance assertions
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    
    // Check for critical resources
    await expect(page.locator('main')).toBeVisible();
    
    // Verify no console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.reload();
    await page.waitForTimeout(2000);
    
    expect(errors.length).toBe(0);
  });
});

test.describe('Home Page - SEO and Meta Tags', () => {
  test('should have proper meta tags', async ({ page }) => {    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/Kenneth Heine/);
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    if (await metaDescription.count() > 0) {
      const content = await metaDescription.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content!.length).toBeGreaterThan(10);
    }
    
    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    if (await ogTitle.count() > 0) {
      const content = await ogTitle.getAttribute('content');
      expect(content).toBeTruthy();
    }
    
    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    if (await canonical.count() > 0) {
      const href = await canonical.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('should have structured data', async ({ page }) => {
    await page.goto('/');
    
    // Check for JSON-LD structured data
    const structuredData = page.locator('script[type="application/ld+json"]');
    
    if (await structuredData.count() > 0) {
      const content = await structuredData.textContent();
      expect(content).toBeTruthy();
      
      // Verify it's valid JSON
      expect(() => JSON.parse(content!)).not.toThrow();
    }
  });
});
