import { test } from '../fixtures/ui-test';
import { existingUser } from '../fixtures/users';

test('Login with valid credentials', async ({ account }) => {
  const user = existingUser();
  test.skip(!user, 'Set AE_TEST_EMAIL, AE_TEST_PASSWORD and AE_TEST_NAME for login tests.');
  await account.open();
  await account.openLogin();
  await account.login(user!.email, user!.password, user!.name);
});
