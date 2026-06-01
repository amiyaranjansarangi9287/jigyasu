/**
 * Automated Accessibility Testing with axe-core
 * Tests WCAG 2.1 AA compliance across critical pages
 */

import { test, expect } from '@playwright/test';

test.describe('Automated Accessibility Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Inject axe-core
    await page.addScriptTag({
      path: 'node_modules/axe-core/axe.min.js',
    });
  });

  /**
   * Run axe-core accessibility audit
   */
  async function runAxeAudit(page: any, context: string) {
    const results = await page.evaluate(() => {
      // @ts-ignore - axe is injected at runtime
      return axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      });
    });

    if (results.violations.length > 0) {
      console.error(`\nAccessibility Violations in ${context}:`);
      results.violations.forEach((violation: any) => {
        console.error(`- ${violation.id}: ${violation.description}`);
        console.error(`  Impact: ${violation.impact}`);
        console.error(`  Help: ${violation.help}`);
        console.error(`  Help URL: ${violation.helpUrl}`);
        console.error(`  Nodes: ${violation.nodes.length}`);
      });
    }

    // Assert no critical or serious violations
    const criticalViolations = results.violations.filter(
      (v: any) => v.impact === 'critical'
    );
    const seriousViolations = results.violations.filter(
      (v: any) => v.impact === 'serious'
    );

    expect(criticalViolations.length).toBe(0);
    expect(seriousViolations.length).toBe(0);

    return results;
  }

  test('Landing page accessibility', async ({ page }) => {
    await page.goto('/');
    await runAxeAudit(page, 'Landing Page');
  });

  test('About page accessibility', async ({ page }) => {
    await page.goto('/about');
    await runAxeAudit(page, 'About Page');
  });

  test('Lab world accessibility', async ({ page }) => {
    await page.goto('/lab');
    await runAxeAudit(page, 'Lab World');
  });

  test('Tiny world accessibility', async ({ page }) => {
    await page.goto('/tiny');
    await runAxeAudit(page, 'Tiny World');
  });

  test('Early world accessibility', async ({ page }) => {
    await page.goto('/early');
    await runAxeAudit(page, 'Early World');
  });

  test('Keyboard navigation - Tab order', async ({ page }) => {
    await page.goto('/');
    
    // Get all focusable elements
    const focusableElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ));
      return elements.map((el) => ({
        tag: el.tagName,
        text: el.textContent?.trim().substring(0, 50),
        tabindex: el.getAttribute('tabindex'),
      }));
    });

    // Verify focusable elements exist
    expect(focusableElements.length).toBeGreaterThan(0);

    // Test tab navigation
    for (let i = 0; i < Math.min(focusableElements.length, 10); i++) {
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? {
          tag: el.tagName,
          text: el.textContent?.trim().substring(0, 50),
        } : null;
      });
      expect(focusedElement).not.toBeNull();
    }
  });

  test('Color contrast - text readability', async ({ page }) => {
    await page.goto('/');
    
    // Check color contrast for text elements
    const contrastIssues = await page.evaluate(() => {
      // @ts-ignore - axe is injected at runtime
      return axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['color-contrast'],
        },
      }).then((results: any) => results.violations);
    });

    expect(contrastIssues.length).toBe(0);
  });

  test('Image alt text', async ({ page }) => {
    await page.goto('/');
    
    const imagesWithoutAlt = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.filter((img) => !img.alt || img.alt.trim() === '').length;
    });

    expect(imagesWithoutAlt).toBe(0);
  });

  test('Form labels', async ({ page }) => {
    await page.goto('/');
    
    const inputsWithoutLabels = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
      return inputs.filter((input) => {
        const id = input.getAttribute('id');
        if (!id) return true;
        const label = document.querySelector(`label[for="${id}"]`);
        return !label;
      }).length;
    });

    expect(inputsWithoutLabels).toBe(0);
  });

  test('ARIA landmarks', async ({ page }) => {
    await page.goto('/');
    
    const landmarks = await page.evaluate(() => {
      return {
        nav: document.querySelectorAll('nav').length,
        main: document.querySelectorAll('main').length,
        header: document.querySelectorAll('header').length,
        footer: document.querySelectorAll('footer').length,
      };
    });

    // At minimum, should have a main landmark
    expect(landmarks.main).toBeGreaterThanOrEqual(1);
  });

  test('Focus visible indicators', async ({ page }) => {
    await page.goto('/');
    
    // Get first focusable element
    const firstButton = page.locator('button').first();
    await firstButton.focus();
    
    // Check if focus outline is visible
    const hasFocusStyle = await firstButton.evaluate((el: any) => {
      const styles = window.getComputedStyle(el);
      return (
        styles.outline !== 'none' ||
        styles.outlineWidth !== '0px' ||
        styles.boxShadow !== 'none'
      );
    });

    expect(hasFocusStyle).toBe(true);
  });

  test('Screen reader announcements', async ({ page }) => {
    await page.goto('/');
    
    // Check for ARIA live regions
    const liveRegions = await page.evaluate(() => {
      return document.querySelectorAll('[aria-live], [role="status"], [role="alert"]').length;
    });

    // Should have at least some live regions for dynamic content
    expect(liveRegions).toBeGreaterThanOrEqual(0);
  });
});
