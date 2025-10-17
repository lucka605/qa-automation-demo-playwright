import { test, expect } from '@playwright/test';

test('Complete purchase flow after login', async ({ page }) => {
    test.setTimeout(90000);

    // 1. Go to the site
    await page.goto('https://automationexercise.com');

    // 2. Accept cookies if shown
    const consentButton = page.locator('button:has-text("Consent")');
    if (await consentButton.isVisible()) {
        await consentButton.click();
    }

    // 3. Login
    await page.click('a[href="/login"]');
    await page.fill('input[data-qa="login-email"]', 'Test_case_two@gmail.com');
    await page.fill('input[data-qa="login-password"]', 'Test!1234');
    await page.click('button[data-qa="login-button"]');

    // 11. Click on 'Products'
    await page.click('a[href="/products"]');

    // 12. Scroll to the end
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000); // Allow time to load products

    // 13. Choose "Half Sleeves Top Schiffli Detailing - Pink"
    const productCard = page.locator('p:has-text("Half Sleeves Top Schiffli Detailing - Pink")').first();
    await productCard.scrollIntoViewIfNeeded();
    const addToCart = productCard.locator('..').locator('a:has-text("Add to cart")');
    await expect(addToCart).toBeVisible();
    await addToCart.click();

    // 14. Click on 'View Cart'
    await page.click('u:has-text("View Cart")');

    // 15. Click on 'Proceed To Checkout'
    await page.click('a:has-text("Proceed To Checkout")');

    // 16. Add comment in comment field
    await page.fill('textarea[name="message"]', 'This is a test order comment.');

    // 17. Click on 'Place Order'
    await page.click('a:has-text("Place Order")');

    // 18. Fill fake card info
    await page.fill('input[name="name_on_card"]', 'Luqman QA');
    await page.fill('input[name="card_number"]', '4111111111111111');
    await page.fill('input[name="cvc"]', '123');
    await page.fill('input[name="expiry_month"]', '12');
    await page.fill('input[name="expiry_year"]', '2026');

    // 19. Click on 'Pay and Confirm Order'
    await page.click('button#submit');

    // Optional: verify success message
    await page.click('a[data-qa="continue-button"]');
});
