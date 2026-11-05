import { expect, type Page } from '@playwright/test';

/** Shared navigation and consent behavior for Automation Exercise UI pages. */
export class BasePage {
  constructor(protected readonly page: Page) {}

  async open(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.dismissConsent();
  }

  async dismissConsent() {
    const button = this.page.getByRole('button', { name: /^(consent|accept all|agree)$/i });
    // Consent is optional and provider-dependent. Do not introduce fixed sleeps.
    if (await button.isVisible().catch(() => false)) {
      await button.click();
    }
  }

  async expectHome() {
    await expect(this.page.locator('img[alt="Website for automation practice"]')).toBeVisible();
  }
}
