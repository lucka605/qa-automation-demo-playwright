import { test } from '../fixtures/ui-test';
import { existingUser } from '../fixtures/users';

test('Purchase a product with demo payment details', async ({ account, products, checkout }) => {
  const user = existingUser();
  test.skip(!user, 'Set AE_TEST_EMAIL, AE_TEST_PASSWORD and AE_TEST_NAME.');
  await account.open();
  await account.openLogin();
  await account.login(user!.email, user!.password, user!.name);
  await products.openProducts();
  await products.openProductDetails(1);
  await products.addDetailsProductToCart();
  await products.viewCart();
  await checkout.completeWithDummyCard();
});
