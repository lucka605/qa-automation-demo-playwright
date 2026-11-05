import { test, expect } from '../fixtures/ui-test';
import { existingUser } from '../fixtures/users';

test('Filter products by category and brand', async ({ account, products, page }) => {
  const user = existingUser();
  test.skip(!user, 'Set AE_TEST_EMAIL, AE_TEST_PASSWORD and AE_TEST_NAME.');
  await account.open();
  await account.openLogin();
  await account.login(user!.email, user!.password, user!.name);
  await products.openProducts();
  await products.filterPolo();
  await expect(page.locator('.features_items .productinfo').first()).toBeVisible();
});
