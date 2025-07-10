# Telegram Mini Apps – Backend Developer Guide

This guide focuses on the backend responsibilities required to support Telegram Mini Apps. It complements the frontend documentation by covering secure session validation, bot API interactions, and payment workflows.

---

## 1. Validate `initData` for Session Integrity

Telegram Web Apps pass `initData` from the frontend, which must be validated on the server using your bot token.

### Node.js Validation Example

```js
const crypto = require('crypto');

function validateInitData(initData, botToken) {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');

  const sortedParams = [...urlParams.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => `${key}=${val}`)
    .join('\n');

  const secret = crypto.createHash('sha256').update(botToken).digest();
  const hmac = crypto.createHmac('sha256', secret).update(sortedParams).digest('hex');

  return hmac === hash;
}
```

---

## 2. Respond to `answerWebAppQuery`

Use this method when the frontend calls `sendData()` with a query ID.

### Example

```json
{
  "web_app_query_id": "<query_id>",
  "result": {
    "type": "article",
    "id": "1",
    "title": "Order Confirmed",
    "message_text": "Thank you for your purchase!"
  }
}
```

---

## 3. Payments with `sendInvoice`

Your bot can generate invoices that will be rendered inside the Telegram Web App.

### Example API Call

```json
{
  "chat_id": 123456789,
  "title": "Subscription",
  "description": "Monthly Plan",
  "payload": "sub_monthly",
  "provider_token": "<PROVIDER_TOKEN>",
  "currency": "USD",
  "prices": [
    { "label": "Access", "amount": 500 },
    { "label": "Addon", "amount": 200 }
  ],
  "suggested_tip_amounts": [100, 200, 500],
  "is_flexible": true,
  "need_email": true,
  "need_name": true
}
```

---

## 4. Handle Payment Events

You must handle two key events to complete the payment cycle:

### `pre_checkout_query`

```js
bot.on("pre_checkout_query", (query) => {
  bot.answerPreCheckoutQuery(query.id, true);
});
```

### `successful_payment`

```js
bot.on("successful_payment", (msg) => {
  console.log("Payment successful:", msg.successful_payment);
  bot.sendMessage(msg.chat.id, "Thank you! Your payment was successful.");
});
```

---

## 5. File Uploads via Bot API

Telegram Mini Apps can't upload files directly. Let users upload them via bot messages, then fetch them on the server.

### Example

```js
bot.on('message', (msg) => {
  if (msg.document) {
    bot.getFile(msg.document.file_id).then(file => {
      const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;
      // Download and process file from `url`
    });
  }
});
```

---

## 6. Security Best Practices

* Always validate `initData` on the server
* Use HTTPS endpoints
* Never trust data sent directly from the frontend
* Sanitize all inputs, especially in webhook handlers

---

## 7. References

* [Telegram Bot API](https://core.telegram.org/bots/api)
* [Telegram Payments](https://core.telegram.org/bots/payments)
* [Mini Apps Overview](https://core.telegram.org/bots/webapps)

