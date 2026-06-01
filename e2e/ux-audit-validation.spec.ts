import { test, expect } from '@playwright/test';

test.describe('UX Audit Validation Tests', () => {
  
  test.describe('Camp App (Port 3007) Tests', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to camp app directly
      await page.goto('http://localhost:3007', { timeout: 10000 });
    });

    test('UX-003: Hero image should not cause horizontal scroll on mobile', async ({ page }) => {
      // Set viewport to mobile size (iPhone SE)
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Check for horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      
      console.log(`Body width: ${bodyWidth}, Viewport width: ${viewportWidth}`);
      
      // Body width should not exceed viewport width
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
      
      // Check hero image specifically
      const heroImage = page.locator('img[alt*="camp"], img[alt*="hero"], .hero img').first();
      if (await heroImage.isVisible().catch(() => false)) {
        const imageWidth = await heroImage.evaluate(el => (el as HTMLImageElement).width);
        const imageContainerWidth = await heroImage.evaluate(el => el.parentElement?.offsetWidth || 0);
        
        console.log(`Image width: ${imageWidth}, Container width: ${imageContainerWidth}`);
        
        // Image should not overflow its container significantly
        expect(imageWidth).toBeLessThanOrEqual(imageContainerWidth * 1.1); // Allow 10% tolerance
      }
    });

    test('UX-015: Activity card images should maintain aspect ratio', async ({ page }) => {
      await page.waitForTimeout(2000); // Wait for content to load
      
      // Find activity card images
      const cardImages = page.locator('.activity-card img, [class*="card"] img, [class*="Activity"] img');
      const count = await cardImages.count();
      
      console.log(`Found ${count} card images`);
      
      if (count > 0) {
        for (let i = 0; i < Math.min(count, 5); i++) {
          const img = cardImages.nth(i);
          const naturalWidth = await img.evaluate(el => (el as HTMLImageElement).naturalWidth);
          const naturalHeight = await img.evaluate(el => (el as HTMLImageElement).naturalHeight);
          const displayWidth = await img.evaluate(el => (el as HTMLElement).offsetWidth);
          const displayHeight = await img.evaluate(el => (el as HTMLElement).offsetHeight);
          
          const naturalRatio = naturalWidth / naturalHeight;
          const displayRatio = displayWidth / displayHeight;
          
          console.log(`Image ${i}: Natural ${naturalWidth}x${naturalHeight} (${naturalRatio.toFixed(2)}), Display ${displayWidth}x${displayHeight} (${displayRatio.toFixed(2)})`);
          
          // Aspect ratio should be reasonably preserved (within 20%)
          const ratioDiff = Math.abs(naturalRatio - displayRatio) / naturalRatio;
          expect(ratioDiff).toBeLessThan(0.2);
        }
      }
    });
  });

  test.describe('Hub App (Port 3100) Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:3100', { timeout: 10000 });
    });

    test('UX-004: High contrast mode should use proper color tokens', async ({ page }) => {
      // Enable high contrast mode
      await page.evaluate(() => {
        document.documentElement.classList.add('high-contrast');
      });
      
      // Check if high contrast is applied via CSS filter (bad) or color tokens (good)
      const usesFilter = await page.evaluate(() => {
        const html = document.documentElement;
        const computedStyle = window.getComputedStyle(html);
        return computedStyle.filter.includes('contrast');
      });
      
      console.log(`Uses CSS filter: ${usesFilter}`);
      
      // Check if proper color variables are set
      const hasColorVariables = await page.evaluate(() => {
        const html = document.documentElement;
        const computedStyle = window.getComputedStyle(html);
        const bgColor = computedStyle.backgroundColor;
        const textColor = computedStyle.color;
        
        // In proper high contrast, should be black/white
        return bgColor === 'rgb(0, 0, 0)' || bgColor === '#000000' || 
               textColor === 'rgb(255, 255, 255)' || textColor === '#ffffff';
      });
      
      console.log(`Has proper color variables: ${hasColorVariables}`);
      
      // Should NOT use CSS filter
      expect(usesFilter).toBe(false);
      
      // Should use proper color tokens
      expect(hasColorVariables).toBe(true);
    });

    test('UX-007: Container should not cause horizontal scroll', async ({ page }) => {
      // Check multiple viewport sizes
      const viewports = [
        { width: 375, height: 667 },  // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1920, height: 1080 } // Desktop
      ];
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(500);
        
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = await page.evaluate(() => window.innerWidth);
        
        console.log(`Viewport ${viewport.width}x${viewport.height}: Body width ${bodyWidth}, Viewport width ${viewportWidth}`);
        
        // Body should not exceed viewport
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // Allow small margin for scrollbar
      }
    });

    test('UX-008: Should use semantic heading elements, not ARIA roles', async ({ page }) => {
      await page.waitForTimeout(2000);
      
      // Check for improper use of role="heading"
      const ariaHeadings = await page.locator('[role="heading"]').count();
      console.log(`Found ${ariaHeadings} elements with role="heading"`);
      
      // Check for proper semantic h2 elements
      const h2Elements = await page.locator('h2').count();
      console.log(`Found ${h2Elements} h2 elements`);
      
      // Should prefer semantic headings over ARIA roles
      // If ariaHeadings exist, they should be minimal
      expect(ariaHeadings).toBe(0);
    });

    test('UX-009: Mobile nav should have proper safe area insets', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Find mobile bottom navigation
      const mobileNav = page.locator('nav.fixed.bottom-0, .bottom-nav, [class*="bottom"][class*="nav"]');
      
      if (await mobileNav.isVisible().catch(() => false)) {
        const paddingBottom = await mobileNav.evaluate(el => {
          return window.getComputedStyle(el).paddingBottom;
        });
        
        console.log(`Mobile nav padding-bottom: ${paddingBottom}`);
        
        // Should use safe-area-inset or have adequate padding
        const hasSafeArea = await mobileNav.evaluate(el => {
          const style = window.getComputedStyle(el);
          return style.paddingBottom.includes('env') || 
                 parseInt(style.paddingBottom) >= 20;
        });
        
        expect(hasSafeArea).toBe(true);
      } else {
        console.log('Mobile nav not found - may be desktop view or different structure');
      }
    });

    test('UX-013: Search button should have proper ARIA label', async ({ page }) => {
      await page.waitForTimeout(2000);
      
      // Find search button (look for 🔍 emoji or search icon)
      const searchButton = page.locator('button:has-text("🔍"), button[aria-label*="search" i], button[title*="search" i]').first();
      
      if (await searchButton.isVisible().catch(() => false)) {
        const ariaLabel = await searchButton.getAttribute('aria-label');
        const title = await searchButton.getAttribute('title');
        
        console.log(`Search button aria-label: ${ariaLabel}, title: ${title}`);
        
        // Should have either aria-label or title
        expect(ariaLabel || title).toBeTruthy();
      } else {
        console.log('Search button not found');
      }
    });
  });

  test.describe('Landing Page Tests (UX-001, UX-002, UX-006)', () => {
    test('UX-001: Switch Profile button should have focus states', async ({ page }) => {
      // Clear localStorage to trigger landing page
      await page.goto('http://localhost:3100', { timeout: 10000 });
      await page.evaluate(() => localStorage.clear());
      await page.reload();
      
      await page.waitForTimeout(2000);
      
      // Look for switch profile button
      const switchButton = page.locator('button:has-text("Switch Profile"), button:has-text("switch" i)').first();
      
      if (await switchButton.isVisible().catch(() => false)) {
        // Focus the button
        await switchButton.focus();
        
        // Check for focus-visible styles
        const hasFocusRing = await switchButton.evaluate(el => {
          const style = window.getComputedStyle(el);
          return style.outline !== 'none' || 
                 style.boxShadow !== 'none' ||
                 el.classList.contains('focus-visible') ||
                 el.classList.contains('ring-2');
        });
        
        console.log(`Switch profile button has focus ring: ${hasFocusRing}`);
        expect(hasFocusRing).toBe(true);
      } else {
        console.log('Switch Profile button not found on landing page');
      }
    });

    test('UX-002: Activity cards should have descriptive ARIA labels', async ({ page }) => {
      await page.goto('http://localhost:3100', { timeout: 10000 });
      await page.waitForTimeout(2000);
      
      // Find activity cards in recent activity section
      const activityCards = page.locator('button:has-text("Continue"), button:has-text("Start"), [class*="activity"][class*="card"]');
      const count = await activityCards.count();
      
      console.log(`Found ${count} activity cards`);
      
      if (count > 0) {
        for (let i = 0; i < Math.min(count, 3); i++) {
          const card = activityCards.nth(i);
          const ariaLabel = await card.getAttribute('aria-label');
          
          console.log(`Card ${i} aria-label: ${ariaLabel}`);
          
          // Should have descriptive aria-label
          expect(ariaLabel).toBeTruthy();
          expect(ariaLabel?.length).toBeGreaterThan(10); // Should be descriptive
        }
      }
    });

    test('UX-006: Avatar selection should have proper ARIA patterns', async ({ page }) => {
      // Clear localStorage to trigger onboarding
      await page.goto('http://localhost:3100', { timeout: 10000 });
      await page.evaluate(() => localStorage.clear());
      await page.reload();
      
      await page.waitForTimeout(2000);
      
      // Look for avatar selection
      const avatarButtons = page.locator('button:has-text("Choose your avatar") + div button, [class*="avatar"] button');
      const count = await avatarButtons.count();
      
      console.log(`Found ${count} avatar buttons`);
      
      if (count > 0) {
        for (let i = 0; i < Math.min(count, 3); i++) {
          const button = avatarButtons.nth(i);
          const role = await button.getAttribute('role');
          const ariaPressed = await button.getAttribute('aria-pressed');
          const ariaChecked = await button.getAttribute('aria-checked');
          const ariaLabel = await button.getAttribute('aria-label');
          
          console.log(`Avatar ${i}: role=${role}, aria-pressed=${ariaPressed}, aria-checked=${ariaChecked}, aria-label=${ariaLabel}`);
          
          // Should have proper ARIA attributes
          expect(role === 'radio' || ariaPressed !== null || ariaChecked !== null).toBe(true);
        }
      }
    });
  });
});
