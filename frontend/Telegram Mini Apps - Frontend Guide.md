# Telegram Mini Apps – Unified Developer Guide

## Overview

Telegram Web Apps (also known as Mini Apps) are **HTML5 frontend applications** that run within the Telegram client. They are launched from a bot and displayed inside a **Telegram WebView** (on mobile) or iframe (on desktop).

These apps allow developers to provide rich, interactive experiences like:

* Online stores
* Dashboards
* Booking systems
* Payment interfaces

---

## Mini App Launch Options

You can launch a Web App through:

* **Keyboard buttons** using the `web_app` field in `InlineKeyboardButton`
* **Commands or menus** that trigger a bot response with a Web App button
* **Telegram Menu Button** (added manually or via the `BotFather`)

**Example:**

```json
{
  "text": "Open App",
  "web_app": {
    "url": "https://yourdomain.com/app"
  }
}
```

---

## Hosting

Your Web App can be hosted:

* On your own server
* On a static site service (e.g. Vercel, Netlify)
* Behind a CDN (recommended for performance)

**Best practices for CDN usage:**

* Use caching headers for static assets (e.g. max-age, immutable)
* Enable HTTPS and HTTP/2 for performance
* Ensure the domain used to host the Mini App is whitelisted in your bot’s BotFather settings

Your Web App can be hosted:

* On your own server
* On a static site service (e.g. Vercel, Netlify)
* Behind a CDN (recommended for performance)

---

## Telegram.WebApp API Reference

When the app runs inside Telegram, the `window.Telegram.WebApp` object becomes available. It exposes methods and properties to integrate with Telegram.

### Common Properties

| Property                                 | Description                                           |
| ---------------------------------------- | ----------------------------------------------------- |
| `initData`                               | Encrypted string containing user and chat info        |
| `version`                                | Telegram WebApp version                               |
| `platform`                               | "ios", "android", "tdesktop", etc.                    |
| `themeParams`                            | Object with colors matching the user’s Telegram theme |
| `isExpanded`                             | Whether the app is in full-screen mode                |
| `viewportHeight`, `viewportStableHeight` | Dimensions of the Web App view                        |

---

## UI Elements – MainButton & BackButton

### MainButton

```js
Telegram.WebApp.MainButton.setText("Submit");
Telegram.WebApp.MainButton.show();
Telegram.WebApp.MainButton.onClick(() => {
  Telegram.WebApp.sendData("form_submitted");
});
```

Other methods:

* `show()`, `hide()`
* `enable()`, `disable()`
* `setText(string)`
* `onClick(callback)`

### BackButton

```js
Telegram.WebApp.BackButton.show();
Telegram.WebApp.BackButton.onClick(() => {
  // Navigate or close section
});
```

---

## Theme and Layout Customization

```js
Telegram.WebApp.themeParams
```

Includes:

* `bg_color`
* `text_color`
* `hint_color`
* `link_color`
* `button_color`
* `button_text_color`

---

## Data Flow & Communication

### 1. `sendData`

```js
Telegram.WebApp.sendData("selected=red");
```

### 2. `answerWebAppQuery`

This is a **bot server responsibility**:

```json
{
  "type": "article",
  "id": "123",
  "title": "Purchase confirmed",
  "message_text": "Thanks for your order!"
}
```

### Backend (Bot Server) Responsibilities

* Validate `initData` using HMAC-SHA256 with your bot token
* Handle `answerWebAppQuery`, `sendInvoice`, `pre_checkout_query`, and `successful_payment`
* Store sensitive data securely and respond to payment events

### Frontend (Mini App) Responsibilities

* Use `sendData` for interaction
* Use `MainButton`, `BackButton`, and `themeParams` for UI
* Adapt to screen height via `viewportStableHeight`
* Decode `initDataUnsafe` for user context

---

## Events

```js
Telegram.WebApp.onEvent("themeChanged", updateUI);
Telegram.WebApp.onEvent("viewportChanged", resizeUI);
```

Events:

* `themeChanged`
* `viewportChanged`
* `mainButtonClicked`
* `backButtonClicked`
* `settingsButtonClicked`

---

## Advanced Features

### Fullscreen

```js
Telegram.WebApp.expand();
```

### Haptic

```js
Telegram.WebApp.HapticFeedback.impactOccurred('medium');
```

### Geolocation

```js
navigator.geolocation.getCurrentPosition(successCallback);
```

---

## Login Form Example

```html
<form onsubmit="Telegram.WebApp.sendData(document.getElementById('username').value); return false;">
  <input id="username" placeholder="Enter username" />
  <button type="submit">Login</button>
</form>
```

### Validating `initData` (Node.js Example)

```js
const crypto = require('crypto');
const checkString = new URLSearchParams(initDataObj).toString();
const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest();
const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex');
if (hmac !== initDataObj.hash) throw new Error("Invalid initData");
```

### TypeScript/Zod Types for `initDataUnsafe`

```ts
import { z } from "zod";

export const InitDataSchema = z.object({
  user: z.object({
    id: z.number(),
    first_name: z.string(),
    last_name: z.string().optional(),
    username: z.string().optional(),
    language_code: z.string().optional()
  }),
  chat_type: z.string().optional(),
  chat_instance: z.string(),
  auth_date: z.string(),
  hash: z.string()
});
```

---

## Payment Integration (sendInvoice)

### Example (Bot Side)

```json
{
  "chat_id": 123456789,
  "title": "Subscription",
  "description": "Monthly Access",
  "payload": "month_plan",
  "provider_token": "PROVIDER_TOKEN",
  "currency": "USD",
  "prices": [
    {"label": "Access", "amount": 500},
    {"label": "Addon", "amount": 150}
  ],
  "suggested_tip_amounts": [100, 200, 500],
  "need_name": true,
  "need_email": true,
  "is_flexible": true
}
```

### Optional: Shipping Options (for physical goods)

```json
{
  "shipping_options": [
    {
      "id": "fast",
      "title": "Fast Shipping",
      "prices": [{"label": "Delivery", "amount": 1000}]
    },
    {
      "id": "free",
      "title": "Free Shipping",
      "prices": [{"label": "Delivery", "amount": 0}]
    }
  ]
}
```

### Handle Payment Events

* `pre_checkout_query`: respond using `answerPreCheckoutQuery`
* `successful_payment`: acknowledge and deliver service

### Bot Handler Example (Node.js)

```js
bot.on("pre_checkout_query", (query) => {
  bot.answerPreCheckoutQuery(query.id, true);
});

bot.on("successful_payment", (msg) => {
  console.log("Payment received:", msg.successful_payment);
  bot.sendMessage(msg.chat.id, "Thank you! Your payment was successful.");
});
```

* `pre_checkout_query`: respond using `answerPreCheckoutQuery`
* `successful_payment`: acknowledge and deliver service

---

## File Upload or Transfer via Bot

* Telegram Web Apps do not support direct file uploads.
* Use the bot to handle files:

  * Ask user to send file to the bot directly in the chat
  * On bot side, retrieve file ID from the message
  * Use Bot API’s `getFile` and `https://api.telegram.org/file/bot<TOKEN>/<file_path>` to download

### Example

```js
bot.on('message', (msg) => {
  if (msg.document) {
    const fileId = msg.document.file_id;
    bot.getFile(fileId).then(file => {
      const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;
      console.log("Download file from:", url);
    });
  }
});
```

* Alternatively, use an external upload service (e.g. S3, Cloudinary) and let the user paste the file URL into the Mini App interface.
* Telegram Web Apps do not support direct file uploads.
* Use the bot to handle files:

  * Ask user to send file to bot
  * Get file ID and download via Bot API’s `getFile`
* Alternative: Use external service (e.g. S3) and let user paste file URL into Mini App

---

## Localization

```js
const i18n = {
  en: { welcome: "Welcome!" },
  fr: { welcome: "Bienvenue!" }
};
const lang = Telegram.WebApp.initDataUnsafe.user.language_code || 'en';
document.getElementById("welcome").innerText = i18n[lang]?.welcome ?? i18n.en.welcome;
```

For scalable localization, consider using a robust library such as `i18next` or `react-i18next`:

```bash
npm install i18next react-i18next
```

Then structure translation files per locale, and initialize based on Telegram's `language_code`.

```js
const i18n = {
  en: { welcome: "Welcome!" },
  fr: { welcome: "Bienvenue!" }
};
const lang = Telegram.WebApp.initDataUnsafe.user.language_code || 'en';
document.getElementById("welcome").innerText = i18n[lang]?.welcome ?? i18n.en.welcome;
```

---

## Deep Linking & Multi-Page Navigation

* Persist `initData` in URL or localStorage
* Use query params: `?page=settings`
* Use React Router or Next.js pages
* Restore scroll position & height with `viewportStableHeight`

### Example: Extracting Parameters with React Router

```tsx
import { useLocation } from 'react-router-dom';
const useQuery = () => new URLSearchParams(useLocation().search);
const query = useQuery();
const page = query.get('page');
```

### In Next.js

```ts
import { useRouter } from 'next/router';
const router = useRouter();
const page = router.query.page;
```

Use these values to control component rendering or routing logic.

* Persist `initData` in URL or localStorage
* Use query params: `?page=settings`
* Use React Router or Next.js pages
* Restore scroll position & height with `viewportStableHeight`

---

## UX Best Practices

| Pattern                 | Recommendation                                |
| ----------------------- | --------------------------------------------- |
| MainButton              | Prefer over in-app buttons                    |
| Viewport awareness      | Use `viewportStableHeight` for dynamic layout |
| Reduce scroll           | Design above-the-fold experiences             |
| Use BackButton wisely   | Close modal or navigate back                  |
| Light/Dark mode support | Use `themeParams` and media queries           |

---

## Closing the Web App

```js
Telegram.WebApp.close();
```

---

## Security Notes

* Always validate `initData`
* Use HTTPS and secure headers
* Avoid localStorage for sensitive tokens

---

## References

* Telegram Web Apps
* Telegram Bot API (answerWebAppQuery, sendInvoice)
* Payments Integration & Validation

