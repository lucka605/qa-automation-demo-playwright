import { test, expect } from '@playwright/test';

const user = {
    email: 'Test_case_two@gmail.com',
    password: 'Test!1234',
    name: 'Test_case_two'
};

test('Navigate products by category and brand after login', async ({ page }) => {
    test.setTimeout(60000);

    // 1. Go to website
    await page.goto('https://automationexercise.com');

    // Accept cookies if shown
    const consentButton = page.locator('button:has-text("Consent")');
    if (await consentButton.isVisible()) {
        await consentButton.click();
    }

    // 2. Click 'Signup / Login'
    await page.click('a[href="/login"]');

    // 3. Fill login form
    await page.fill('input[data-qa="login-email"]', user.email);
    await page.fill('input[data-qa="login-password"]', user.password);
    await page.click('button[data-qa="login-button"]');

    // 4. Verify login
    await expect(page.locator('a:has-text("Logged in as")')).toContainText(user.name);

    // 5. Click on 'Products' page
    await page.click('a[href="/products"]');
    await expect(page.locator('h2.title:has-text("All Products")')).toBeVisible();

    // 6. Click on 'Women' category
    await page.click('a[href="#Women"]');
    await page.waitForTimeout(1000); // Allow submenu to expand

    // 7. Click on 'Tops' under Women
    await page.click('a[href="/category_products/1"]'); // this is the Tops link

    // 8. Click on 'Polo' brand
    await page.click('a[href="/brand_products/Polo"]');

    // 9. Verify brand filter worked (optional)
    await expect(page.locator('h2.title.text-center')).toContainText('Brand - Polo Products');

    await page.mouse.wheel(0, 5000); // or: await page.evaluate(() => window.scrollBy(0, 1000));
    await page.waitForTimeout(1000);

    // 10. Locate "Soft Stretch Jeans" product
    const jeansProduct = page.locator('p:has-text("Soft Stretch Jeans")').first();
    await expect(jeansProduct).toBeVisible();

    await page.mouse.wheel(0, 5000); // or: await page.evaluate(() => window.scrollBy(0, 1000));
    await page.waitForTimeout(1000);

    // 11. Click "View Product" for Soft Stretch Jeans
    // const jeansCard = page.locator('.productinfo.text-center', { hasText: 'Soft Stretch Jeans' });
    // await jeansCard.scrollIntoViewIfNeeded(); 
    // await expect(jeansCard).toBeVisible();
    // await jeansCard.locator('a:has-text("View Product")').click();
    const productLink = page.locator('a[href="/product_details/33"]');
    await productLink.scrollIntoViewIfNeeded();
    await expect(productLink).toBeVisible();
    await productLink.click();

    // 12. Click "Add to Cart" on product details page
    await page.click('button:has-text("Add to cart")');
    await page.waitForSelector('#cartModal'); // Wait for cart modal

    // 13. Click "Continue Shopping" in modal
    await page.click('button:has-text("Continue Shopping")');

    
});
