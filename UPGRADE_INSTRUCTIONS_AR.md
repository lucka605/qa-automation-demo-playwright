# تحديث مشروع Playwright — تعليمات الدمج

هذه الحزمة **تحديث لملفات المشروع الحالي** وليست مشروعاً مستقلاً. خذ نسخة احتياطية أولاً.

1. فك الضغط وانسخ محتويات الحزمة فوق مجلد `qa-automation-demo-playwright-main` بجانب `package.json`. اختر استبدال الملفات المطابقة.
2. لا تمسح `server/`, `database/compose.yaml`, `database/init.sql`, `tests/integration/` أو Workflow الـIntegration الناجح؛ الحزمة لا تستبدلها.
3. من CMD داخل جذر المشروع:

   ```cmd
   npm install
   npm audit
   npm run typecheck
   scripts\setup-and-test.cmd
   ```

4. لتجربة UI اختيارياً أنشئ حساباً تجريبياً على Automation Exercise وضع القيم كمتغيرات بيئة:

   ```cmd
   set "RUN_PUBLIC_UI=1"
   set "AE_TEST_EMAIL=..."
   set "AE_TEST_PASSWORD=..."
   set "AE_TEST_NAME=..."
   npm run test:ui
   ```

5. تأكد أن `.env` و`playwright-report/` مستثنيان قبل الرفع ثم:

   ```cmd
   git status
   git add .
   git diff --cached --name-only
   git commit -m "refactor: structure Playwright UI tests and CI"
   git push origin main
   ```

## ملاحظة مهمة حول package-lock.json

الحزمة تحدث `package.json` ولا تحتوي lockfile جديداً لأنها لا تستطيع تشغيل npm مع الإنترنت هنا. شغّل `npm install` محلياً لتحديث `package-lock.json`، ثم `npm audit` وتأكد من عدم وجود ثغرات قبل الـCommit.

## التحقق

- الاختبارات الأربعة للـIntegration كانت ناجحة في آخر تشغيل لك، لكن لم يتم تشغيل نسخة التحديث هذه فعلياً ضد موقع Automation Exercise من هذه البيئة.
- الـUI selectors قد تحتاج تعديلات إذا تغير الـDOM في الموقع.
- لا تخلط نجاح CI الخاص بالـIntegration مع نجاح الـUI، فهما منفصلان.
