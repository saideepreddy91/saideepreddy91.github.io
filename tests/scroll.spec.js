// @ts-check
const { test, expect } = require('@playwright/test');

const sections = [
  { id: 'about' },
  { id: 'experience' },
  { id: 'projects' },
  { id: 'skills' },
  { id: 'publications' },
  { id: 'education' },
  { id: 'tutorials' },
  { id: 'contact' },
];

for (const { id } of sections) {
  test(`nav link scrolls #${id} into view`, async ({ page }) => {
    await page.goto('/');
    await page.click(`#navlinks a[href="#${id}"]`);
    await expect(page.locator(`#${id}`)).toBeInViewport({ timeout: 5000 });
  });
}

test('nav gains scrolled class after scrolling down', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#nav')).not.toHaveClass(/scrolled/);
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForFunction(() => window.scrollY >= 800);
  await expect(page.locator('#nav')).toHaveClass(/scrolled/);
});

test('scroll-spy sets the active nav link', async ({ page }) => {
  await page.goto('/');
  await page.click('#navlinks a[href="#projects"]');
  await expect(page.locator('#navlinks a[href="#projects"]'))
    .toHaveClass(/active/, { timeout: 5000 });
});

test('mobile menu opens and closes', async ({ page }) => {
  await page.setViewportSize({ width: 480, height: 900 });
  await page.goto('/');
  await expect(page.locator('#mobileMenu')).not.toHaveClass(/open/);
  await page.click('#menuBtn');
  await expect(page.locator('#mobileMenu')).toHaveClass(/open/);
  await page.click('#menuClose');
  await expect(page.locator('#mobileMenu')).not.toHaveClass(/open/);
});

test('hero canvas is present and animating by default', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#heroCanvas')).toHaveCount(1);
  await expect.poll(() => page.evaluate(() => window.__heroAnimating))
    .toBe(true);
});

test('reduced motion disables the hero animation loop', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  try {
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page.locator('#heroCanvas')).toHaveCount(1);
    await expect.poll(() => page.evaluate(() => window.__heroAnimating))
      .toBe(false);
  } finally {
    await ctx.close();
  }
});
