// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  debug: true,
  app: {
    head: {
      script: [
        { src: 'https://telegram.org/js/telegram-web-app.js' }
      ]
    }
  },
  runtimeConfig: {
    // Этот токен доступен ТОЛЬКО на сервере
    telegramBotToken: process.env.NUXT_TELEGRAM_BOT_TOKEN,
    // А то, что в public - доступно и на клиенте (нам это не нужно для токена)
    public: {}
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  css: ['/assets/css/main.css'],
  devtools: { enabled: true }
})
