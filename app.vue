<template>
  <div class="page">
    <h1>Nuxt Mini App</h1>
    
    <div v-if="!authResult">
      <p>Загрузка...</p>
    </div>

    <div v-else class="result">
      <p>Статус: {{ authResult.success ? '✅ Авторизован' : '❌ Ошибка' }}</p>
      <pre>{{ authResult.message }}</pre>
      <p v-if="authResult.user">Твой ID: {{ authResult.user.id }}</p>
    </div>
    
    <button @click="handleAction">Сделать действие</button>
  </div>
</template>

<script setup>
// Лучше использовать скрипт в head, но можно и npm пакет @twa-dev/sdk
useHead({
  script: [{ src: 'https://telegram.org/js/telegram-web-app.js', defer: true }]
})

const authResult = ref(null)

onMounted(async () => {
  // Ждем загрузки скрипта TWA
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp
    tg.ready()
    tg.expand()
    
    // Получаем "сырую" строку данных для валидации
    const initData = tg.initData
    
    if (!initData) {
      authResult.value = { success: false, message: "Запущено не в Telegram" }
      return
    }

    // Отправляем на наш сервер Nuxt
    try {
      const response = await $fetch('/api/auth', {
        method: 'POST',
        body: { initData }
      })
      authResult.value = response
    } catch (e) {
      authResult.value = { success: false, message: "Ошибка валидации на сервере" }
    }
  }
})

const handleAction = () => {
  window.Telegram.WebApp.showAlert('Кнопка работает!')
}
</script>

<style>
body {
    background-color: var(--tg-theme-bg-color);
    color: var(--tg-theme-text-color);
}
</style>