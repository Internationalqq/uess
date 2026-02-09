/**
 * Серверная функция: принимает данные формы и отправляет в Telegram.
 * Для Vercel: положите в api/telegram.js и задайте переменные окружения:
 *   TELEGRAM_BOT_TOKEN — токен бота от @BotFather
 *   TELEGRAM_CHAT_ID  — ваш chat_id (личные сообщения)
 *
 * Как получить chat_id: напишите боту любое сообщение, затем откройте в браузере:
 *   https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates
 * В ответе найдите "chat":{"id": 123456789} — это ваш chat_id.
 */

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).send(JSON.stringify({ ok: false, error: 'Только POST' }));
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).send(JSON.stringify({
      ok: false,
      error: 'На Vercel не заданы TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID. Settings → Environment Variables → Redeploy.'
    }));
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (_) { body = {}; }
    }
    if (!body || typeof body !== 'object') body = {};
    const { name, phone, email, message } = body;
    const text = [
      '🆕 <b>Новая заявка с сайта УЭСС</b>',
      '',
      `<b>Имя:</b> ${name || '—'}`,
      `<b>Телефон:</b> ${phone || '—'}`,
      `<b>Email:</b> ${email || '—'}`,
      `<b>Сообщение:</b> ${message || '—'}`
    ].join('\n');

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();
    if (!data.ok) {
      return res.status(500).send(JSON.stringify({
        ok: false,
        error: data.description || 'Telegram отклонил сообщение'
      }));
    }

    return res.status(200).send(JSON.stringify({ ok: true }));
  } catch (err) {
    return res.status(500).send(JSON.stringify({
      ok: false,
      error: err.message || 'Ошибка сервера'
    }));
  }
};
