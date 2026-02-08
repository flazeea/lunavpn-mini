<template>
  <div class="container">
    <div v-if="loading">
      <p>Загрузка...</p>
    </div>

    <div v-else-if="error" class="error">
      <h3>Ошибка доступа</h3>
      <p>{{ error }}</p>
      <button @click="clearSession">Сбросить сессию</button>
    </div>

    <div v-else class="content">
      <h1>Привет, {{ user?.first_name }}!</h1>
      <p>ID: {{ user?.id }}</p>
      <p>Статус: Авторизован ✅</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const user = ref<any>(null)
const error = ref<string | null>(null)
const loading = ref(true)

// Ключ для хранения данных сессии
const STORAGE_KEY = 'tg-init-data'

onMounted(async () => {
  try {
    // 1. Динамический импорт SDK (решает проблему сборки)
    const WebApp = (await import('@twa-dev/sdk')).default
    WebApp.ready()

    // 2. Пытаемся получить данные из ДВУХ источников:
    // А) Напрямую от Телеграма (актуально при первом входе)
    let initData = WebApp.initData
    
    // Б) Если от Телеграма пришло пусто (например, при перезагрузке),
    // берем из sessionStorage
    if (!initData) {
      initData = sessionStorage.getItem(STORAGE_KEY) || ''
    }

    // 3. Если данных все равно нет — останавливаемся
    if (!initData) {
      error.value = "Приложение должно быть запущено в Telegram"
      loading.value = false
      return
    }

    // 4. Сохраняем строку в сессию (на случай будущей перезагрузки)
    sessionStorage.setItem(STORAGE_KEY, initData)

    // 5. Отправляем на бэкенд
    const response = await $fetch('/api/auth', {
      method: 'POST',
      body: { initData }
    })

    if (response.success) {
      user.value = response.user
    }
    
  } catch (e: any) {
    console.error("Auth error:", e)
    // Если ошибка 401 (истек срок действия или неверная подпись),
    // нужно очистить протухшие данные
    if (e.response?.status === 401 || e.response?.status === 403) {
      sessionStorage.removeItem(STORAGE_KEY)
      error.value = "Сессия истекла. Перезапустите приложение."
    } else {
      error.value = e.data?.statusMessage || "Ошибка соединения с сервером"
    }
  } finally {
    loading.value = false
  }
})

const clearSession = () => {
  sessionStorage.removeItem(STORAGE_KEY)
  window.location.reload()
}
</script>

<style>
/* Добавьте немного стилей для читаемости */
body { 
    background-color: var(--tg-theme-bg-color, #fff); 
    color: var(--tg-theme-text-color, #000);
}
.error { color: red; text-align: center; margin-top: 50px; }
button { padding: 10px; margin-top: 20px; }
</style>