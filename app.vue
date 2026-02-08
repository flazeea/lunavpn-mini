<script setup lang="ts">
import { ref, onMounted } from 'vue'

const user = ref<any>(null)
const error = ref<string | null>(null)
const loading = ref(true)

const STORAGE_KEY = 'tg-init-data'

onMounted(async () => {
  try {
    const WebApp = (await import('@twa-dev/sdk')).default
    WebApp.ready()

    // 1. Получаем свежие данные
    let initData = WebApp.initData
    
    // 2. Логика: 
    // Если данные есть в SDK (мы зашли из ТГ) -> используем их и ОБНОВЛЯЕМ storage
    if (initData) {
      console.log('Using fresh WebApp data')
      sessionStorage.setItem(STORAGE_KEY, initData)
    } 
    // Если в SDK пусто (перезагрузка страницы) -> пытаемся взять из storage
    else {
      console.log('WebApp data empty, checking storage')
      initData = sessionStorage.getItem(STORAGE_KEY) || ''
    }

    if (!initData) {
      throw new Error("Нет данных авторизации (initData пуст)")
    }

    // 3. Отправляем на сервер
    const response = await $fetch('/api/auth', {
      method: 'POST',
      body: { initData }
    })
    
    // Если успех
    if (response.success) {
      user.value = response.user
    }
    
  } catch (e: any) {
    console.error("Auth Error Details:", e)
    
    // Показываем ошибку пользователю
    const status = e.response?.status
    const msg = e.data?.statusMessage || e.message
    
    if (status === 401) {
       // Если 401, значит данные невалидны. Удаляем их, чтобы не зацикливать ошибку.
       sessionStorage.removeItem(STORAGE_KEY)
       error.value = `Сессия истекла (Server: ${msg}). Перезайдите в Mini App.`
    } else {
       error.value = `Ошибка: ${msg}`
    }
  } finally {
    loading.value = false
  }
})
</script>