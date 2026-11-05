import { test as base } from '@playwright/test';
import { AccountPage } from '../pages/AccountPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CheckoutPage } from '../pages/CheckoutPage';

interface Fixtures { account: AccountPage; products: ProductsPage; checkout: CheckoutPage }
export const test = base.extend<Fixtures>({
  account: async ({ page }, use) => { await use(new AccountPage(page)); },
  products: async ({ page }, use) => { await use(new ProductsPage(page)); },
  checkout: async ({ page }, use) => { await use(new CheckoutPage(page)); },
});
test.beforeEach(() => {
  test.skip(process.env.RUN_PUBLIC_UI !== '1', 'Set RUN_PUBLIC_UI=1 to explicitly test the external demo website.');
});
export { expect } from '@playwright/test';
