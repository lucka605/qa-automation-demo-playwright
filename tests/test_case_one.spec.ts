import { test } from '../fixtures/ui-test';
import { newUser } from '../fixtures/users';

test('Register and delete a new user on Automation Exercise', async ({ account }) => {
  const user = newUser();
  await account.open();
  await account.expectHome();
  await account.openLogin();
  await account.register(user);
  await account.deleteAccount();
});
