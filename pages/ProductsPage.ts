import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  constructor(page: Page) { super(page); }

  async openProducts() {
    await this.page.locator('a[href="/products"]').click();
    await expect(this.page.getByText('All Products', { exact: true })).toBeVisible();
  }

  async filterPolo() {
    await this.page.locator('a[href="#Women"]').click();
    await this.page.locator('a[href="/category_products/1"]').click();
    await this.page.locator('a[href="/brand_products/Polo"]').click();
    await expect(this.page.locator('h2.title.text-center')).toContainText('Brand - Polo Products');
  }

  async openProductDetails(productId: number) {
    const productLink = this.page.locator(`a[href="/product_details/${productId}"]`).first();
    await productLink.scrollIntoViewIfNeeded();
    await productLink.click();
    await expect(this.page.locator('.product-information')).toBeVisible();
  }

  async addDetailsProductToCart() {
    await this.page.getByRole('button', { name: /add to cart/i }).click();
    await expect(this.page.locator('#cartModal')).toBeVisible();
  }

  async continueShopping() {
    await this.page.getByRole('button', { name: 'Continue Shopping' }).click();
  }

  async viewCart() {
    await this.page.locator('#cartModal').getByText('View Cart').click();
    await expect(this.page).toHaveURL(/\/view_cart/);
  }
}
