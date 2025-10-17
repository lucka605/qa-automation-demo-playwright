# QA Automation Demo – Playwright

This is a demo project created to showcase end-to-end (E2E) test automation using [Playwright](https://playwright.dev/) with TypeScript.
## 🎥 Demo Video

[Click here to watch the demo video]
https://drive.google.com/file/d/1W1dZ9hOe2UV9CsRonF6VvQFpzM3Clo0_/view?usp=drive_link

## ✅ Tech Stack

- **Language**: TypeScript
- **Framework**: Playwright
- **Runner**: Playwright Test
- **CI Ready**: Azure DevOps compatible
- **Report**: HTML Reporter + Trace Viewer

---

## 🧪 Test Coverage

The following scenarios were automated and validated:

1. **Register a New User**  
   - Full form filling with random data via `faker.js`
   - Account creation and validation

2. **Login Existing User**  
   - Valid login using static credentials
   - Session validation

3. **Navigate Products & Purchase**  
   - Filter by **category** (Women > Tops) and **brand** (Polo)  
   - Add products to cart  
   - Proceed to checkout  
   - Enter payment details (dummy data)  
   - Confirm order

4. **API Test Integration**  
   - Fetch product list via `GET /api/productsList`
   - Validate product data before UI flow

---

## ▶️ Run Tests Locally

```bash
# Install dependencies
npm install

# Run all tests
npx playwright test

# Run with HTML report
npx playwright test --reporter=html

# Open the last HTML report
npx playwright show-report
