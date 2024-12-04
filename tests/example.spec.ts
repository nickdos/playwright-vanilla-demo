import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

// Needed for BIE WAF on GH actions servers
test.use({ userAgent: 'GH Actions Bot 1.0' });

test('ALA search button test', async ({ page }) => {
  const baseUrl = 'https://bie.ala.org.au';
  await page.goto(baseUrl);

  // Type text into the search input.
  await page.fill('#search', 'Acacia');

  // Click the get started link.
  await page.getByRole('button', { name: 'Search', exact: true }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Search for Acacia' })).toBeVisible();

});
