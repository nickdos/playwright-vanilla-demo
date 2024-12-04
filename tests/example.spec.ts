import { test, expect } from '@playwright/test';
const fs = require('fs');

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
  await page.goto('https://bie.ala.org.au');

  // Type text into the search input.
  await page.fill('#search', 'Acacia');

  // Click the get started link.
  await page.getByRole('button', { name: 'Search', exact: true }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Search for Acacia' })).toBeVisible();

});

test('Acacia download test', async ({ page }) => {
  await page.goto('https://bie.ala.org.au/search?q=Acacia&rows=20');

  // Enable async handling of downloads
  const downloadPromise = page.waitForEvent('download');

  // Perform the action that initiates the download
  await page.getByRole('link', { name: ' Download' }).click(); // Unicode character for download icon

  // Wait for download to begin
  const download = await downloadPromise;

  // Wait for the download process to complete and get the downloaded file path
  await download.saveAs('/tmp/' + download.suggestedFilename());
  const filePath = await download.path();

  // Read file contents directly without saving permanently
  const fileContent = await fs.promises.readFile(filePath, 'utf-8');

  // Verify file contents
  expect(fileContent).toContain('taxonID');
  expect(fileContent).toContain('scientificName');
  expect(fileContent).toContain('APNI');
  expect(fileContent).toContain('Acacia dealbata');

  // Check file is roughly the expected size (over 3000 lines)
  const lineCount = fileContent.split('\n').length;
  expect(lineCount).toBeGreaterThan(3000);
});