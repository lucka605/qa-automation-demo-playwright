import { test, expect } from '../fixtures/ui-test';
import { existingUser } from '../fixtures/users';

test('API catalog check followed by UI checkout', async ({ request, account, products, checkout }) => {
  const user = existingUser();
  test.skip(!user, 'Set AE_TEST_EMAIL, AE_TEST_PASSWORD and AE_TEST_NAME.');
  const response = await request.get('https://automationexercise.com/api/productsList');
  expect(response.status()).toBe(200);
  const catalog = await response.json();
  expect(catalog.responseCode).toBe(200);
  expect(Array.isArray(catalog.products)).toBe(true);
  expect(catalog.products.length).toBeGreaterThan(0);
  await account.open();
  await account.openLogin();
  await account.login(user!.email, user!.password, user!.name);
  await products.openProducts();
  await products.openProductDetails(1);
  await products.addDetailsProductToCart();
  await products.viewCart();
  await checkout.completeWithDummyCard();
});
