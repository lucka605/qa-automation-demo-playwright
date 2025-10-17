import { test, expect } from '@playwright/test';

const user = {
    email: 'Test_case_two@gmail.com',
    password: 'Test!1234',
    name: 'Test_case_two'
};

test('Navigate products and complete purchase with API validation', async ({ page, request }) => {
    test.setTimeout(100000);

    // 1. API Check before UI flow – get product list
    const apiResponse = await request.get('https://automationexercise.com/api/productsList');
    expect(apiResponse.ok()).toBeTruthy();
    const products = await apiResponse.json();
    console.log(`✅ Retrieved ${products.products.length} products via API`);

    await page.waitForTimeout(1000); // 👁️ Delay before UI

    // 2. Go to website
    await page.goto('https://automationexercise.com');
    await page.waitForTimeout(1500);

    // 3. Accept cookies if shown
    const consentButton = page.locator('button:has-text("Consent")');
    if (await consentButton.isVisible()) {
        await consentButton.click();
        await page.waitForTimeout(1000);
    }

    // 4. Click 'Signup / Login'
    await page.click('a[href="/login"]');
    await page.waitForTimeout(1500);

    // 5. Fill login form
    await page.fill('input[data-qa="login-email"]', user.email);
    await page.fill('input[data-qa="login-password"]', user.password);
    await page.waitForTimeout(1000);
    await page.click('button[data-qa="login-button"]');
    await page.waitForTimeout(1500);

    // 6. Verify login
    await expect(page.locator('a:has-text("Logged in as")')).toContainText(user.name);
    await page.waitForTimeout(1000);

    // 7. Click on 'Products' page
    await page.click('a[href="/products"]');
    await page.waitForTimeout(1500);
    await expect(page.locator('h2.title:has-text("All Products")')).toBeVisible();
    await page.waitForTimeout(1000);

    // 8. Click on 'Women' category
    await page.click('a[href="#Women"]');
    await page.waitForTimeout(1000);

    // 9. Click on 'Tops' under Women
    await page.click('a[href="/category_products/1"]');
    await page.waitForTimeout(1500);

    // 10. Click on 'Polo' brand
    await page.click('a[href="/brand_products/Polo"]');
    await page.waitForTimeout(1500);

    // 11. Verify brand filter
    await expect(page.locator('h2.title.text-center')).toContainText('Brand - Polo Products');
    await page.waitForTimeout(1000);

    await page.mouse.wheel(0, 5000);
    await page.waitForTimeout(1500);

    // 12. Locate "Soft Stretch Jeans" product
    const jeansProduct = page.locator('p:has-text("Soft Stretch Jeans")').first();
    await expect(jeansProduct).toBeVisible();
    await page.waitForTimeout(1000);

    // 13. View Product
    const productLink = page.locator('a[href="/product_details/33"]');
    await productLink.scrollIntoViewIfNeeded();
    await expect(productLink).toBeVisible();
    await productLink.click();
    await page.waitForTimeout(1500);

    // 14. Add to cart
    await page.click('button:has-text("Add to cart")');
    await page.waitForSelector('#cartModal');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Continue Shopping")');
    await page.waitForTimeout(1500);

    // 15. Back to Products
    await page.click('a[href="/products"]');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    // 16. Add second product
    const productCard = page.locator('p:has-text("Half Sleeves Top Schiffli Detailing - Pink")').first();
    await productCard.scrollIntoViewIfNeeded();
    const addToCart = productCard.locator('..').locator('a:has-text("Add to cart")');
    await expect(addToCart).toBeVisible();
    await addToCart.click();
    await page.waitForTimeout(1500);

    // 17. View cart
    await page.click('u:has-text("View Cart")');
    await page.waitForTimeout(1500);

    // 18. Proceed to checkout
    await page.click('a:has-text("Proceed To Checkout")');
    await page.waitForTimeout(1000);

    // 19. Add comment
    await page.fill('textarea[name="message"]', 'This is a test order comment.');
    await page.waitForTimeout(1000);

    // 20. Place order
    await page.click('a:has-text("Place Order")');
    await page.waitForTimeout(1000);

    // 21. Fill card info
    await page.fill('input[name="name_on_card"]', 'Luqman QA');
    await page.fill('input[name="card_number"]', '4111111111111111');
    await page.fill('input[name="cvc"]', '123');
    await page.fill('input[name="expiry_month"]', '12');
    await page.fill('input[name="expiry_year"]', '2026');
    await page.waitForTimeout(1500);

    // 22. Pay and confirm
    await page.click('button#submit');
    await page.waitForTimeout(2000);

    // 23. Click continue
    await page.click('a[data-qa="continue-button"]');
});
