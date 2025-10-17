import { test, expect } from '@playwright/test';

const existingUser = {
  email: 'Test_case_two@gmail.com',
  password: 'Test!1234',
  name: 'Test_case_two' // This is the first name to verify in "Logged in as" section
};

test('Test Case 2: Login User with correct email and password', async ({ page }) => {
  test.setTimeout(60000); // Extend test timeout to avoid test failure due to slowness

  await page.goto('https://automationexercise.com');

  // Handle cookie consent popup if it appears
  const consentButton = page.locator('button:has-text("Consent")');
  if (await consentButton.isVisible()) {
    await consentButton.click();
  }

  // Verify that the home page is visible
  await expect(page.locator('img[alt="Website for automation practice"]')).toBeVisible();

  // Click on 'Signup / Login' button
  await page.click('a[href="/login"]');

  // Verify 'Login to your account' is visible
  await expect(page.locator('h2:has-text("Login to your account")')).toBeVisible();

  // Fill in email and password
  await page.fill('input[data-qa="login-email"]', existingUser.email);
  await page.fill('input[data-qa="login-password"]', existingUser.password);

  // Click 'Login' button
  await page.click('button[data-qa="login-button"]');

  // Verify successful login
  await expect(page.locator('a:has-text("Logged in as")')).toContainText(existingUser.name);

//   // Click 'Delete Account' button
//   await page.click('a[href="/delete_account"]');

//   // Verify account deletion
//   await expect(page.locator('b:has-text("Account Deleted!")')).toBeVisible();

//   // Click 'Continue' button after deletion
//   await page.click('a[data-qa="continue-button"]');
});
