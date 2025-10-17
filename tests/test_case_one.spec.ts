import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

const testUser = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password({ length: 10, memorable: true }),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  company: faker.company.name(),
  address1: faker.location.streetAddress(),
  address2: faker.location.secondaryAddress(),
  country: 'Canada', 
  state: faker.location.state(),
  city: faker.location.city(),
  zipcode: faker.location.zipCode(),
mobile: faker.string.numeric('09########')
};


test('Test Case 1: Register User on automationexercise.com', async ({ page }) => {
    test.setTimeout(60000); 
  await page.waitForTimeout(5000);
  await page.goto('https://automationexercise.com');
  const consentButton = page.locator('button:has-text("Consent")');
  if (await consentButton.isVisible()) {
    await consentButton.click();
  }


  // Verify home page
  await expect(page).toHaveURL(/automationexercise/);
  await expect(page.locator('img[alt="Website for automation practice"]')).toBeVisible();
  await page.waitForTimeout(1000);

  // Click 'Signup / Login'
  await page.click('a[href="/login"]');
  await page.waitForTimeout(1000);
  await expect(page.locator('h2:has-text("New User Signup!")')).toBeVisible();

  // Enter name and email, click Signup
  await page.fill('input[data-qa="signup-name"]', testUser.name);
  await page.fill('input[data-qa="signup-email"]', testUser.email);
  await page.waitForTimeout(500);
  await page.click('button[data-qa="signup-button"]');

  // Verify 'ENTER ACCOUNT INFORMATION'
  await page.waitForTimeout(1000);
  await expect(page.locator('b:has-text("Enter Account Information")')).toBeVisible();

  // Fill form details
  await page.check('#id_gender1');
  await page.fill('#password', testUser.password);
  await page.selectOption('#days', '1');
  await page.selectOption('#months', '1');
  await page.selectOption('#years', '1997');

  await page.waitForTimeout(500);

  await page.check('#newsletter');
  await page.check('#optin');

  await page.fill('#first_name', testUser.firstName);
  await page.fill('#last_name', testUser.lastName);
  await page.fill('#company', testUser.company);
  await page.fill('#address1', testUser.address1);
  await page.fill('#address2', testUser.address2);
  await page.selectOption('#country', testUser.country);
  await page.fill('#state', testUser.state);
  await page.fill('#city', testUser.city);
  await page.fill('#zipcode', testUser.zipcode);
  await page.fill('#mobile_number', testUser.mobile);

  await page.waitForTimeout(1000);
  await page.click('button[data-qa="create-account"]');

  // Verify 'ACCOUNT CREATED!' and click Continue
  await page.waitForTimeout(1000);
  await expect(page.locator('b:has-text("Account Created!")')).toBeVisible();
  await page.click('a[data-qa="continue-button"]');

  // Verify user is logged in
  await page.waitForTimeout(1000);
  await expect(page.locator('a:has-text("Logged in as")')).toContainText(testUser.name.split(' ')[0]);

  // Delete account
  // await page.waitForTimeout(1000);
  // await page.click('a[href="/delete_account"]');
  // await expect(page.locator('b:has-text("Account Deleted!")')).toBeVisible();
  // await page.click('a[data-qa="continue-button"]');
});
