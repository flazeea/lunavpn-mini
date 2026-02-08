<template>
  <div class="container">
    <div v-if="loading">Загрузка...</div>
    
    <div v-else-if="error" class="error">
      Ошибка: {{ error }}
    </div>

    <div v-else class="content">
      <h1>Привет, {{ user?.first_name }}!</h1>
      <p>Твой ID: {{ user?.id }}</p>
      <button @click="handleBtn">Тест кнопки</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// Импортируем SDK напрямую. Благодаря ssr: false в конфиге, 
// это не вызовет ошибку "window is not defined" при старте.
import WebApp from '@twa-dev/sdk'

const user = ref<any>(null)
const error = ref<string | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    // 1. Инициализация
    WebApp.ready()
    WebApp.expand() // Раскрыть на весь экран

    // 2. Получаем "сырые" данные
    const initData = WebApp.initData
    
    // Если приложение открыто просто в браузере (не в ТГ), initData будет пустой
    if (!initData) {
      error.value = "Приложение запущено не в Telegram!"
      loading.value = false
      return
    }

    // 3. Отправляем на бэкенд для проверки
    // Используем $fetch, так как это Nuxt
    const response = await $fetch('/api/auth', {
      method: 'POST',
      body: { initData } // Отправляем строку целиком
    })
    
    if (response.success) {
      user.value = response.user
    }
  } catch (e: any) {
    console.error(e)
    error.value = e.data?.statusMessage || "Ошибка валидации"
  } finally {
    loading.value = false
  }
})

const handleBtn = () => {
  WebApp.showAlert('Всё работает!')
}
</script>

<style>
/* Стили для темной темы по умолчанию */
body {
  background-color: var(--tg-theme-bg-color, #212121);
  color: var(--tg-theme-text-color, #ffffff);
  font-family: sans-serif; 
}
.error { color: #ff5555; }
</style>