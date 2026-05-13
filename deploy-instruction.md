# Deploy Instructions

هذا الملف يشرح طريقة الدخول إلى السيرفر وتحديث تطبيق `nova` بأمان، مع تطبيق تحديثات قاعدة البيانات بدون حذف أو استبدال البيانات الحالية.

## Server Access

- SSH host alias: `hemati`
- Project path on server: `/var/www/nova`
- Effective project owner on server: `deploy`
- PM2 app name: `nova`
- App start mode in PM2: `npm start -- --port 3005`

مهم:
- لا تعمل داخل `/var/www/nova` كمستخدم `root` إلا عند الحاجة للوصول فقط.
- نفّذ أوامر المشروع كمستخدم `deploy` حتى لا تتخربط الصلاحيات.

## SSH Login

للدخول للسيرفر:

```bash
ssh hemati
```

للدخول مباشرة كمستخدم `deploy` داخل المشروع:

```bash
ssh hemati
sudo -u deploy -i
cd /var/www/nova
```

أو بسطر واحد:

```bash
ssh hemati 'sudo -u deploy bash -lc "cd /var/www/nova && bash"'
```

## Before Updating

افحص حالة المشروع أولًا:

```bash
ssh hemati 'sudo -u deploy bash -lc "cd /var/www/nova && git status --short --branch && pm2 describe nova"'
```

افحص ملف البيئة:

```bash
ssh hemati 'sudo -u deploy bash -lc "cd /var/www/nova && sed -n \"1,40p\" .env"'
```

ملاحظات مهمة:
- قاعدة البيانات تقرأ من ملف `.env` داخل السيرفر.
- لا تستبدل قاعدة البيانات من local إلا إذا كان هناك تلف فعلي أو طلب صريح.
- النظام الحالي يعمل بمبدأ migration آمن: ينشئ الجداول الجديدة ويعبئها من البيانات الموجودة بدون حذف البيانات الأصلية.

## Safe Deploy Steps

نفّذ الخطوات التالية بالترتيب.

### 1. دخول إلى السيرفر كمستخدم `deploy`

```bash
ssh hemati
sudo -u deploy -i
cd /var/www/nova
```

### 2. أخذ نسخة احتياطية من قاعدة البيانات

```bash
mkdir -p backups
export $(grep -v '^#' .env | xargs)
stamp=$(date +%Y%m%d-%H%M%S)
pg_dump "$DATABASE_URL" > "backups/nova-$stamp.sql"
```

هذا backup منطقي كامل بدون لمس البيانات.

### 3. حفظ أي تعديلات محلية على السيرفر قبل `git pull`

إذا ظهر تعديل محلي غير مهم مثل `package-lock.json`:

```bash
git stash push -m "pre-deploy-$stamp"
```

إذا لم يكن هناك تعديلات:

```bash
git status --short
```

### 4. سحب آخر تحديث من GitHub

```bash
git fetch origin
git pull --ff-only origin main
```

لا تستخدم `git reset --hard` إلا إذا كنت متأكدًا جدًا ووافق المسؤول عن السيرفر.

### 5. تثبيت الحزم

```bash
npm ci
```

### 6. بناء التطبيق

```bash
npm run build
```

### 7. تطبيق تحديثات قاعدة البيانات بدون حذف البيانات

النظام الحالي لا يعتمد على ملفات migration منفصلة. التحديث يتم عبر طبقة `dashboard-repo` نفسها، وهي:
- تنشئ الجداول المطلوبة إذا لم تكن موجودة
- تهاجر البيانات القديمة إلى الجداول الجديدة
- لا تستبدل البيانات الموجودة بقاعدة بيانات من local

لتنفيذ migration يدويًا:

```bash
npx tsx -e "import { getDashboardStore } from './lib/dashboard-repo'; (async () => { const store = await getDashboardStore(); console.log(JSON.stringify({ locales: store.locales.length, sections: store.homeSections.length, pages: store.pages.length, treatments: store.treatments.length, doctors: store.doctors.length, categories: store.blogCategories.length, posts: store.blogPosts.length, admins: store.siteSettings.admins.length }, null, 2)); })();"
```

هذا الأمر:
- يضمن إنشاء schema
- يضمن migration للبيانات
- لا يحذف البيانات الحالية
- يطبع ملخصًا سريعًا للتأكد أن القراءة نجحت

## Restart Application

بعد نجاح البناء وmigration:

```bash
pm2 restart nova
pm2 save --force
pm2 list
```

## Verify After Deploy

افحص التطبيق:

```bash
pm2 logs nova --lines 100
```

تحقق من أن التطبيق يعمل:

```bash
curl -I http://127.0.0.1:3005
```
## Database Notes

البنية الحالية أصبحت منظمة في جداول فعلية مثل:

- `admin_users`
- `site_settings`
- `site_locales`
- `home_sections`
- `home_section_localizations`
- `home_section_items`
- `managed_pages`
- `page_localizations`
- `page_stats`
- `page_cards`
- `page_sections`
- `page_ctas`
- `page_offices`
- `page_faqs`
- `treatments`
- `treatment_localizations`
- `doctors`
- `doctor_localizations`
- `blog_categories`
- `blog_category_localizations`
- `blog_posts`
- `blog_post_localizations`

الجدول القديم `dashboard_content` بقي كمرجع legacy/backup، لكن التحديثات الجديدة تعمل على الجداول المنظمة.

## Important Safety Rules

- لا تحذف ملف `.env`
- لا تستبدل قاعدة البيانات من local إلا عند الضرورة القصوى
- دائمًا خذ `pg_dump` قبل أي deploy
- استخدم `git pull --ff-only`
- شغّل `npm run build` قبل `pm2 restart`
- نفّذ migration قبل restart إن كان هناك تغييرات على قاعدة البيانات
- لا تشغّل أوامر المشروع كمستخدم `root` داخل ملفات المشروع

