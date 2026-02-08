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
    let initData = 'query_id=AAGAD2ELAwAAAIAPYQtnuKPj&user=%7B%22id%22%3A6633361280%2C%22first_name%22%3A%22flazee%21%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22fl4zee%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22added_to_attachment_menu%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2Fyk6BZ0nIUvh22aBZJ3PtpgSuBB5wBBGTzrAjuKZ6c98pHaAYipwjaBwsFiVDQSLY.svg%22%7D&auth_date=1770551340&signature=PKTbdI1bJ1HqdOTAvkERXrUEGJ1fTtz1jvevEHizXJHoDfHWHyd3UVsAVklVYIRdDt8dMjwVUpCxpczL1kciDw&hash=ddee3a63df109a481ec953c57f5fff44402735e69a4a7b6e4653680b3a30c856'
    
    console.log("SENDING DATA:", initData)
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
      body: { initData:initData }
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