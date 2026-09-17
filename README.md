# Merge & Earn — Telegram Mini App

English-first React + TypeScript + Vite implementation of the Merge & Earn game. It is optimized for Telegram's mobile webview and includes a responsive 6×6 merge board, energy regeneration, XP/levels, daily reward, referral CTA, sound effects, and a 20-language selector.

## Run locally

```bash
npm install
npm run dev
```

Open the Vite URL in a browser or Telegram Mini App preview. The UI gracefully works outside Telegram; add `@twa-dev/sdk` initialization and your backend API when deploying.

## Languages

English, Uzbek, Russian, Spanish, French, German, Chinese, Arabic, Hindi, Portuguese, Japanese, Korean, Turkish, Italian, Dutch, Polish, Ukrainian, Vietnamese, Indonesian, and Persian are available in the selector. Core game labels have localized translations with English fallback for future content.

## Production integration checklist

- Verify Telegram `initData` with HMAC-SHA256 on the Node/Express backend; never trust client coin or XP values.
- Persist board, energy, XP, referrals, and daily-claim state in MongoDB.
- Add server-side rate limiting (60 requests/minute) and replay protection.
- Connect AdsGram rewarded callbacks before unlocking a locked board.
- Add TON Connect and Telegram Stars only behind server-verified purchase callbacks.
- Replace the demo referral URL and configure the bot's Menu Button / Web App URL in BotFather.
