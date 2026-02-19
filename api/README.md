# Отправка заявок в Telegram

Форма с сайта отправляет данные в ваш Telegram через бота. Логика в папке `api/` — это **серверная часть**: её тоже нужно выгружать (на Vercel она подхватывается автоматически).

## Весь сайт на Vercel (рекомендуется)

Если вы деплоите **целый репозиторий** на Vercel (и статику, и папку `api/`):

1. Импортируйте проект на [vercel.com](https://vercel.com) и нажмите **Deploy**.
2. Сайт будет по адресу вида `https://ваш-проект.vercel.app`, а API — по `https://ваш-проект.vercel.app/api/telegram`.
3. В проекте Vercel: **Settings** → **Environment Variables** добавьте:
   - `TELEGRAM_BOT_TOKEN` — токен от @BotFather  
   - `TELEGRAM_CHAT_ID` — ваш chat_id (число)
4. **Deployments** → у последнего деплоя **⋯** → **Redeploy**, чтобы подхватить переменные.

После этого форма на сайте будет слать заявки в Telegram. Отдельно выгружать «бота» не нужно — это одна serverless-функция в том же проекте.

---

## Сайт на GitHub Pages (API отдельно на Vercel)

GitHub Pages не умеет запускать API. Нужно **отдельно** задеплоить только API на Vercel (бесплатно), а сайт оставить на GitHub Pages.

### Шаг 1. Деплой API на Vercel

1. Зайдите на [vercel.com](https://vercel.com), войдите через GitHub.
2. **New Project** → **Import Git Repository**. Выберите репозиторий с этим сайтом (где лежат `index.html` и папка `api/`).
3. Оставьте настройки по умолчанию, нажмите **Deploy**.
4. После деплоя откройте проект → вкладка **Settings** → **Environment Variables**. Добавьте:
   - `TELEGRAM_BOT_TOKEN` — токен бота от @BotFather
   - `TELEGRAM_CHAT_ID` — ваш chat_id (число, например 944575923)
5. Снова зайдите в **Deployments** → у последнего деплоя нажмите **⋯** → **Redeploy** (чтобы подхватить переменные).

У вас появится адрес вида: `https://ваш-проект.vercel.app`

### Шаг 2. Подключить API к форме на GitHub Pages

В **index.html** найдите строку (она рядом с комментарием про API):

```html
<script>window.CONTACT_FORM_API_URL = '';</script>
```

Вставьте между кавычками ссылку на ваш API (с `/api/telegram` в конце):

```html
<script>window.CONTACT_FORM_API_URL = 'https://ваш-проект.vercel.app/api/telegram';</script>
```

Сохраните, закоммитьте и запушьте в репозиторий. GitHub Pages обновится — форма на сайте будет отправлять заявки на этот адрес, а Vercel будет слать их в Telegram.

---

## Как получить токен и chat_id

### Токен бота
- В Telegram откройте [@BotFather](https://t.me/BotFather) → отправьте `/newbot` → придумайте имя и username → скопируйте выданный **токен**.

### Chat ID
- Напишите вашему боту любое сообщение (например «Привет»).
- В браузере откройте (подставьте свой токен):
  ```
  https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates
  ```
- В ответе найдите `"chat":{"id": 123456789}` — это ваш **chat_id**.
