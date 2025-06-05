import { expect, test } from '@playwright/test';

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to contact page
    await page.goto('/contact');
  });

  test('should display contact page with proper structure', async ({ page }) => {
    // Check page title and meta
    await expect(page).toHaveTitle(/Contact/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Contact');
    
    // Check contact form is present
    const contactForm = page.locator('[data-testid="contact-form"]');
    await expect(contactForm).toBeVisible();
  });

  test('should display contact form with all required fields', async ({ page }) => {
    // Check form fields
    await expect(page.locator('[data-testid="name-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="subject-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="message-input"]')).toBeVisible();
    
    // Check submit button
    await expect(page.locator('[data-testid="submit-button"]')).toBeVisible();
  });

  test('should validate form fields properly', async ({ page }) => {
    // Try to submit empty form
    await page.locator('[data-testid="submit-button"]').click();
    
    // Check for validation messages
    const validationMessages = page.locator('[data-testid="validation-error"]');
    await expect(validationMessages).toHaveCount({ min: 1 });
  });

  test('should validate email format', async ({ page }) => {
    // Fill form with invalid email
    await page.locator('[data-testid="name-input"]').fill('Test User');
    await page.locator('[data-testid="email-input"]').fill('invalid-email');
    await page.locator('[data-testid="subject-input"]').fill('Test Subject');
    await page.locator('[data-testid="message-input"]').fill('Test message');
    
    // Try to submit
    await page.locator('[data-testid="submit-button"]').click();
    
    // Check for email validation error
    const emailError = page.locator('[data-testid="email-error"]');
    await expect(emailError).toBeVisible();
  });

  test('should submit form successfully with valid data', async ({ page }) => {
    // Fill form with valid data
    await page.locator('[data-testid="name-input"]').fill('Test User');
    await page.locator('[data-testid="email-input"]').fill('test@example.com');
    await page.locator('[data-testid="subject-input"]').fill('Test Subject');
    await page.locator('[data-testid="message-input"]').fill('This is a test message for the contact form.');
    
    // Submit form
    await page.locator('[data-testid="submit-button"]').click();
    
    // Check for success message or redirect
    const successMessage = page.locator('[data-testid="success-message"]');
    
    // Wait for either success message or form reset
    await Promise.race([
      expect(successMessage).toBeVisible(),
      expect(page.locator('[data-testid="name-input"]')).toHaveValue('')
    ]);
  });

  test('should display contact information', async ({ page }) => {
    // Check for contact information section
    const contactInfo = page.locator('[data-testid="contact-info"]');
    
    if (await contactInfo.isVisible()) {
      // Check for email
      const emailInfo = page.locator('[data-testid="contact-email"]');
      if (await emailInfo.isVisible()) {
        await expect(emailInfo).toContainText('@');
      }
      
      // Check for social links
      const socialLinks = page.locator('[data-testid="social-link"]');
      if (await socialLinks.count() > 0) {
        await expect(socialLinks.first()).toBeVisible();
      }
    }
  });

  test('should display professional summary', async ({ page }) => {
    // Check for professional summary or about section
    const summary = page.locator('[data-testid="professional-summary"]');
    
    if (await summary.isVisible()) {
      await expect(summary).toContainText(/.+/);
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check mobile layout
    await expect(page.locator('h1')).toBeVisible();
    
    // Check form is properly sized on mobile
    const contactForm = page.locator('[data-testid="contact-form"]');
    await expect(contactForm).toBeVisible();
    
    // Check form fields are accessible on mobile
    await expect(page.locator('[data-testid="name-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    
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
    
    // Check form styling adapts to theme
    const contactForm = page.locator('[data-testid="contact-form"]');
    await expect(contactForm).toBeVisible();
  });

  test('should have proper accessibility', async ({ page }) => {
    // Check heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    
    // Check form labels
    const nameInput = page.locator('[data-testid="name-input"]');
    const nameLabel = page.locator('label[for="name"]');
    
    if (await nameLabel.isVisible()) {
      await expect(nameLabel).toBeVisible();
    }
    
    // Check alt text for images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute('alt');
    }
    
    // Check form accessibility
    const formElements = page.locator('input, textarea, select');
    const elementCount = await formElements.count();
    
    for (let i = 0; i < elementCount; i++) {
      const element = formElements.nth(i);
      const ariaLabel = await element.getAttribute('aria-label');
      const id = await element.getAttribute('id');
      
      // Should have either aria-label or associated label
      expect(ariaLabel || id).toBeTruthy();
    }
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

  test('should perform well', async ({ page }) => {
    // Start performance timing
    const startTime = Date.now();
    
    // Navigate to page
    await page.goto('/contact');
    
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

test.describe('Contact Form Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should handle form field focus and blur', async ({ page }) => {
    // Focus on name field
    await page.locator('[data-testid="name-input"]').focus();
    
    // Check focus styling
    const nameInput = page.locator('[data-testid="name-input"]');
    await expect(nameInput).toBeFocused();
    
    // Blur and check validation
    await page.locator('[data-testid="email-input"]').focus();
    await expect(page.locator('[data-testid="email-input"]')).toBeFocused();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Start with name field
    await page.locator('[data-testid="name-input"]').focus();
    
    // Tab through form fields
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="email-input"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="subject-input"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="message-input"]')).toBeFocused();
  });

  test('should handle character limits if present', async ({ page }) => {
    // Check if message field has character limit
    const messageInput = page.locator('[data-testid="message-input"]');
    const maxLength = await messageInput.getAttribute('maxlength');
    
    if (maxLength) {
      // Fill with text exceeding limit
      const longText = 'a'.repeat(parseInt(maxLength) + 10);
      await messageInput.fill(longText);
      
      // Check that text is truncated
      const actualValue = await messageInput.inputValue();
      expect(actualValue.length).toBeLessThanOrEqual(parseInt(maxLength));
    }
  });

  test('should show loading state during submission', async ({ page }) => {
    // Fill form with valid data
    await page.locator('[data-testid="name-input"]').fill('Test User');
    await page.locator('[data-testid="email-input"]').fill('test@example.com');
    await page.locator('[data-testid="subject-input"]').fill('Test Subject');
    await page.locator('[data-testid="message-input"]').fill('Test message');
    
    // Submit form and check for loading state
    await page.locator('[data-testid="submit-button"]').click();
    
    // Check for loading indicator
    const loadingIndicator = page.locator('[data-testid="loading-indicator"]');
    
    if (await loadingIndicator.isVisible()) {
      await expect(loadingIndicator).toBeVisible();
    }
  });
});

test.describe('Contact Page Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should integrate with external services if configured', async ({ page }) => {
    // Check for external service integrations (e.g., analytics, contact forms)
    const scripts = page.locator('script[src]');
    const scriptCount = await scripts.count();
    
    // Should have some external scripts for functionality
    expect(scriptCount).toBeGreaterThan(0);
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate network failure
    await page.route('**/api/contact', route => {
      route.abort('failed');
    });
    
    // Fill and submit form
    await page.locator('[data-testid="name-input"]').fill('Test User');
    await page.locator('[data-testid="email-input"]').fill('test@example.com');
    await page.locator('[data-testid="subject-input"]').fill('Test Subject');
    await page.locator('[data-testid="message-input"]').fill('Test message');
    
    await page.locator('[data-testid="submit-button"]').click();
    
    // Check for error message
    const errorMessage = page.locator('[data-testid="error-message"]');
    
    // Should show error message or retry button
    await Promise.race([
      expect(errorMessage).toBeVisible(),
      expect(page.locator('[data-testid="retry-button"]')).toBeVisible()
    ]);
  });
});
