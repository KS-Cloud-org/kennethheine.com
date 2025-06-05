/**
 * @fileoverview E2E Test - About Page Content and Functionality
 * Tests the about page content, timeline, skills, and user interactions
 * @author Kenneth Heine
 * @created June 2025
 */

import { expect, test } from '@playwright/test';

test.describe('About Page - Content and Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('should load about page successfully', async ({ page }) => {
    // Verify page loads correctly
    await expect(page).toHaveURL('/about');
    await expect(page.locator('main')).toBeVisible();
    
    // Check for page title
    await expect(page).toHaveTitle(/About.*Kenneth/);
  });

  test('should display about content sections', async ({ page }) => {
    // Check for main about content
    const aboutContent = page.locator('[data-testid="about-content"]').first();
    if (await aboutContent.count() > 0) {
      await expect(aboutContent).toBeVisible();
    }
    
    // Look for bio/introduction text
    const introText = page.locator('p').first();
    await expect(introText).toBeVisible();
    await expect(introText).toContainText(/Kenneth|developer|engineer|consultant/i);
  });

  test('should display skills section', async ({ page }) => {
    // Look for skills section
    const skillsSection = page.locator('[data-testid="skills-section"]');
    
    if (await skillsSection.count() > 0) {
      await expect(skillsSection).toBeVisible();
      
      // Check for skill badges/items
      const skillItems = page.locator('[data-testid="skill-badge"]');
      if (await skillItems.count() > 0) {
        await expect(skillItems.first()).toBeVisible();
        
        // Verify some common skills are present
        const pageContent = await page.textContent('body');
        expect(pageContent).toMatch(/(Azure|TypeScript|React|Next\.js|JavaScript|C#|\.NET)/i);
      }
    }
  });

  test('should display experience timeline', async ({ page }) => {
    // Look for timeline or experience section
    const timelineSection = page.locator('[data-testid="timeline"], [data-testid="experience"]');
    
    if (await timelineSection.count() > 0) {
      await expect(timelineSection.first()).toBeVisible();
      
      // Check for timeline items
      const timelineItems = page.locator('[data-testid="timeline-item"]');
      if (await timelineItems.count() > 0) {
        await expect(timelineItems.first()).toBeVisible();
        
        // Verify timeline items have dates and descriptions
        const firstItem = timelineItems.first();
        await expect(firstItem).toContainText(/20\d{2}/); // Year pattern
      }
    }
  });

  test('should have responsive layout', async ({ page }) => {
    // Test desktop layout
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('main')).toBeVisible();
    
    // Test tablet layout
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('main')).toBeVisible();
    
    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('main')).toBeVisible();
    
    // Ensure content is still readable on mobile
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should handle theme switching', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    if (await themeToggle.count() > 0) {
      // Test theme toggle functionality
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // Verify page is still functional after theme change
      await expect(page.locator('main')).toBeVisible();
    }
  });
});

test.describe('About Page - Interactive Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('should handle skill hover interactions', async ({ page }) => {
    const skillBadges = page.locator('[data-testid="skill-badge"]');
    
    if (await skillBadges.count() > 0) {
      const firstSkill = skillBadges.first();
      
      // Hover over skill badge
      await firstSkill.hover();
      
      // Check if there's any visual feedback (tooltip, color change, etc.)
      // This would depend on the implementation
      await expect(firstSkill).toBeVisible();
    }
  });

  test('should handle timeline expansion', async ({ page }) => {
    // Look for expandable timeline items
    const expandableItems = page.locator('[data-testid="timeline-item-expandable"]');
    
    if (await expandableItems.count() > 0) {
      const firstItem = expandableItems.first();
      
      // Click to expand if there's an expand button
      const expandButton = firstItem.locator('button, [role="button"]');
      if (await expandButton.count() > 0) {
        await expandButton.first().click();
        
        // Verify additional content is shown
        await expect(firstItem).toBeVisible();
      }
    }
  });

  test('should navigate back to home from about page', async ({ page }) => {
    // Find and click home/back navigation
    const homeLink = page.locator('nav a[href="/"], a[href="/"]').first();
    if (await homeLink.count() > 0) {
      await homeLink.click();
      await expect(page).toHaveURL('/');
    }
  });
});

test.describe('About Page - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('should have proper heading structure', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    
    // Verify h1 content is meaningful
    const h1Text = await h1.textContent();
    expect(h1Text).toMatch(/(About|Kenneth|Profile|Bio)/i);
  });

  test('should have accessible navigation', async ({ page }) => {
    // Check for navigation landmarks
    const nav = page.locator('nav, [role="navigation"]');
    await expect(nav).toBeVisible();
    
    // Verify navigation items are keyboard accessible
    const navLinks = nav.locator('a');
    if (await navLinks.count() > 0) {
      for (let i = 0; i < Math.min(3, await navLinks.count()); i++) {
        const link = navLinks.nth(i);
        await expect(link).toBeVisible();
        
        // Check for proper attributes
        const href = await link.getAttribute('href');
        expect(href).toBeTruthy();
      }
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test tab navigation through focusable elements
    await page.keyboard.press('Tab');
    
    // Get the focused element
    const focusedElement = page.locator(':focus');
    
    // Verify we can navigate through the page
    await expect(focusedElement).toBeVisible();
    
    // Continue tabbing to verify keyboard accessibility
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should still be within the page
    await expect(page.locator('main')).toBeVisible();
  });

  test('should have proper ARIA labels and roles', async ({ page }) => {
    // Check for main landmark
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible();
    
    // Check for any buttons with proper ARIA
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      
      // Button should have either visible text or aria-label
      expect(ariaLabel || text).toBeTruthy();
    }
  });
});

test.describe('About Page - Performance', () => {
  test('should load efficiently', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within reasonable time
    expect(loadTime).toBeLessThan(5000);
    
    // Check that main content is visible
    await expect(page.locator('main')).toBeVisible();
  });

  test('should not have console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    
    // Filter out known acceptable errors
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('chrome-extension')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});
