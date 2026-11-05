import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import type { NewUser } from '../fixtures/users';

export class AccountPage extends BasePage {
  constructor(page: Page) { super(page); }

  async openLogin() {
    await this.page.locator('a[href="/login"]').click();
    await expect(this.page.getByText('Login to your account', { exact: true })).toBeVisible();
  }

  async login(email: string, password: string, expectedName: string) {
    await this.page.locator('input[data-qa="login-email"]').fill(email);
    await this.page.locator('input[data-qa="login-password"]').fill(password);
    await this.page.locator('button[data-qa="login-button"]').click();
    await expect(this.page.locator('a', { hasText: 'Logged in as' })).toContainText(expectedName);
  }

  async register(user: NewUser) {
    await this.page.locator('input[data-qa="signup-name"]').fill(user.name);
    await this.page.locator('input[data-qa="signup-email"]').fill(user.email);
    await this.page.locator('button[data-qa="signup-button"]').click();
    await expect(this.page.getByText('Enter Account Information', { exact: true })).toBeVisible();
    await this.page.locator('#id_gender1').check();
    await this.page.locator('#password').fill(user.password);
    await this.page.locator('#days').selectOption('1');
    await this.page.locator('#months').selectOption('1');
    await this.page.locator('#years').selectOption('1997');
    await this.page.locator('#first_name').fill(user.firstName);
    await this.page.locator('#last_name').fill(user.lastName);
    await this.page.locator('#company').fill(user.company);
    await this.page.locator('#address1').fill(user.address1);
    await this.page.locator('#address2').fill(user.address2);
    await this.page.locator('#country').selectOption(user.country);
    await this.page.locator('#state').fill(user.state);
    await this.page.locator('#city').fill(user.city);
    await this.page.locator('#zipcode').fill(user.zipcode);
    await this.page.locator('#mobile_number').fill(user.mobile);
    await this.page.locator('button[data-qa="create-account"]').click();
    await expect(this.page.getByText('Account Created!', { exact: true })).toBeVisible();
    await this.page.locator('a[data-qa="continue-button"]').click();
    await expect(this.page.locator('a', { hasText: 'Logged in as' })).toContainText(user.name);
  }

  async deleteAccount() {
    await this.page.locator('a[href="/delete_account"]').click();
    await expect(this.page.getByText('Account Deleted!', { exact: true })).toBeVisible();
  }
}
