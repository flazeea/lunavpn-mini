<template>
  <footer class="w-full pt-0 pb-6 absolute left-0 bottom-0 content-end justify-center items-center flex flex-col gap-4">
    <div class="w-full flex flex-col items-center justify-center">
      <p class="text-white/10 text-sm">© 2024 LunaVPN Mini. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Состояния для интерфейса
const user = ref(null)
const status = ref('Ожидание запуска...')
const errorMsg = ref('')

onMounted(async () => {
  // 1. Проверяем, что мы в Telegram
  if (!window.Telegram?.WebApp) {
    status.value = 'Открыто не в Telegram'
    return
  }

  const tg = window.Telegram.WebApp
  tg.ready() // Сообщаем, что приложение готово
  tg.expand() // Разворачиваем

  // 2. Получаем строку для валидации
  const initData = tg.initData

  if (!initData) {
    status.value = 'Нет данных авторизации (возможно, запуск локально без бота)'
    
    // Для тестов можно подставить данные из initDataUnsafe, но это НЕБЕЗОПАСНО
    // user.value = tg.initDataUnsafe.user 
    return
  }

  status.value = 'Проверка данных на сервере...'

  try {
    // 3. Отправляем запрос на наш API (который мы создали ранее в server/api/auth.post.ts)
    const { data, error } = await useFetch('/api/auth', {
      method: 'POST',
      body: { initData } // Шлем сырую строку
    })

    if (error.value) {
      throw new Error(error.value.message)
    }

    // 4. Если всё ок, сервер вернул нам валидированного пользователя
    if (data.value && data.value.user) {
      user.value = data.value.user
      status.value = `Привет, ${user.value.first_name}!`
      
      // Здесь можно сохранить JWT токен, если сервер его прислал
      // const token = useCookie('auth_token')
      // token.value = data.value.token
    }

  } catch (e) {
    console.error(e)
    errorMsg.value = 'Ошибка авторизации: ' + e.message
    status.value = 'Ошибка'
  }
})
</script>

<style>

</style>