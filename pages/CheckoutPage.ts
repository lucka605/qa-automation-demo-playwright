import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  constructor(page: Page) { super(page); }

  async completeWithDummyCard() {
    await this.page.getByText('Proceed To Checkout', { exact: true }).click();
    await expect(this.page).toHaveURL(/\/checkout/);
    await this.page.locator('textarea[name="message"]').fill('QA automated test order');
    await this.page.getByText('Place Order', { exact: true }).click();
    await this.page.locator('input[name="name_on_card"]').fill('QA Test User');
    // Dummy card details strictly for this training website; no real payments.
    await this.page.locator('input[name="card_number"]').fill('4111111111111111');
    await this.page.locator('input[name="cvc"]').fill('123');
    await this.page.locator('input[name="expiry_month"]').fill('12');
    await this.page.locator('input[name="expiry_year"]').fill('2030');
    await this.page.locator('button#submit').click();
    await expect(this.page.getByText('Order Placed!', { exact: true })).toBeVisible();
    await expect(this.page.getByText('Congratulations! Your order has been confirmed!', { exact: false })).toBeVisible();
  }
}
