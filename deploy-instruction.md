# Deploy Instructions

هذا الملف يشرح طريقة تحديث تطبيق `nova` على السيرفر الحالي، مع الحفاظ على ملف البيئة وقاعدة البيانات الحالية.

## Server Details

- SSH host alias: `hemati`
- Server user currently used for this project: `root`
- Project path on server: `/var/www/nova`
- Git branch: `main`
- PM2 app name: `nova`
- PM2 start command: `npm start -- --port 3002 --hostname 127.0.0.1`
- Public domain: `novatech-nas.ae`
- Nginx site file: `/etc/nginx/sites-available/nova`
- Nginx upstream: `http://127.0.0.1:3002`

مهم:
- المشروع الحالي على السيرفر مملوك لـ `root` وPM2 يعمل تحت `root`.
- لا تبدّل إلى مستخدم `deploy` إلا بعد نقل ملكية `/var/www/nova` وتشغيل PM2 من نفس المستخدم.
- لا تحذف ملف `.env` ولا تستبدل قاعدة البيانات من local.

## SSH Login

```bash
ssh hemati
cd /var/www/nova
```

أو بسطر واحد:

```bash
ssh hemati 'cd /var/www/nova && bash'
```

## Before Updating

افحص حالة المشروع والتطبيق:

```bash
ssh hemati 'cd /var/www/nova && git status --short --branch && pm2 describe nova'
```

افحص وجود ملف البيئة بدون طباعته كاملًا في المحادثات العامة:

```bash
ssh hemati 'cd /var/www/nova && test -f .env && sed -n "1,20p" .env'
```

تأكد أن nginx يقرأ ملف الموقع الصحيح:

```bash
ssh hemati 'nginx -T 2>/dev/null | grep -n "server_name\\|proxy_pass" | grep -A1 -B1 "novatech\\|nova"'
```

## Safe Deploy Steps

نفّذ الخطوات التالية بالترتيب.

### 1. ادخل إلى السيرفر

```bash
ssh hemati
cd /var/www/nova
```

### 2. خذ نسخة احتياطية من قاعدة البيانات

```bash
mkdir -p backups
set -a
. ./.env
set +a
stamp=$(date +%Y%m%d-%H%M%S)
pg_dump "$DATABASE_URL" > "backups/nova-$stamp.sql"
```

هذا backup منطقي كامل ولا يغيّر البيانات.

### 3. احفظ أي تعديلات محلية على السيرفر قبل السحب

افحص الحالة:

```bash
git status --short --branch
```

إذا ظهرت تعديلات محلية غير مطلوبة:

```bash
git stash push -m "pre-deploy-$stamp"
```

لا تستخدم `git reset --hard` إلا بطلب صريح.

### 4. اسحب آخر تحديث من GitHub

```bash
git fetch origin
git pull --ff-only origin main
```

### 5. ثبّت الحزم

```bash
npm ci
```

### 6. طبّق schema والبيانات الافتراضية بأمان

هذا المشروع لا يستخدم `dashboard-repo` ولا migrations منفصلة. التحديث الصحيح يتم عبر:

```bash
npm run db:push
```

الأمر يقوم بالتالي:
- ينشئ جداول PostgreSQL الناقصة.
- يضيف البيانات الافتراضية فقط إذا لم تكن موجودة.
- لا يستبدل الصفوف الموجودة بسبب استخدام `ON CONFLICT DO NOTHING` و`WHERE NOT EXISTS`.

### 7. ابن التطبيق

```bash
npm run build
```

### 8. أعد تشغيل التطبيق

```bash
pm2 restart nova --update-env
pm2 save --force
pm2 list
```

إذا لم يكن التطبيق موجودًا في PM2:

```bash
pm2 start npm --name nova -- start -- --port 3002 --hostname 127.0.0.1
pm2 save --force
```

## Nginx Domain

الدومين الحالي المطلوب هو:

```text
novatech-nas.ae
www.novatech-nas.ae
```

احفظ نسخة من ملف nginx قبل التعديل:

```bash
stamp=$(date +%Y%m%d-%H%M%S)
cp /etc/nginx/sites-available/nova "/etc/nginx/sites-available/nova.bak-$stamp"
```

تأكد أن الملف يحتوي على:

```nginx
server {
    server_name novatech-nas.ae www.novatech-nas.ae;

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

ثم استخرج أو حدّث شهادة SSL:

```bash
certbot --nginx -d novatech-nas.ae -d www.novatech-nas.ae
```

بعد أي تعديل:

```bash
nginx -t
systemctl reload nginx
```

## Verify After Deploy

افحص logs:

```bash
pm2 logs nova --lines 100
```

تحقق من التطبيق محليًا من داخل السيرفر:

```bash
curl -I http://127.0.0.1:3002
```

تحقق من الدومين:

```bash
curl -I https://novatech-nas.ae
curl -I https://www.novatech-nas.ae
```

## Database Notes

الجداول الحالية التي ينشئها `npm run db:push`:

- `admins`
- `settings`
- `section_content`
- `hero`
- `partners`
- `certifications`
- `gallery_images`
- `blogs`
- `about_cards`
- `services`
- `catalog_products`
- `industries`
- `footer_links`

## Important Safety Rules

- لا تحذف ملف `.env`.
- لا تستبدل قاعدة البيانات من local.
- خذ `pg_dump` قبل أي deploy.
- استخدم `git pull --ff-only`.
- شغّل `npm run db:push` قبل `npm run build` إذا كان السيرفر جديدًا أو هناك تغييرات schema.
- شغّل `npm run build` قبل `pm2 restart`.
- لا تغيّر منفذ PM2 أو nginx إلا معًا.
