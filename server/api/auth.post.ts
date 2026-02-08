// server/api/auth.post.ts
import { verifyTelegramWebAppData } from '../utils/telegram'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { initData } = body

    const config = useRuntimeConfig()

    // 1. Проверяем валидность данных
    const isValid = verifyTelegramWebAppData(initData, config.telegramBotToken)

    if (!isValid) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Invalid Telegram Data'
        })
    }

    // 2. Парсим данные пользователя (они безопасны, т.к. мы проверили подпись)
    const urlParams = new URLSearchParams(initData)
    const user = JSON.parse(urlParams.get('user') || '{}')

    // 3. Тут можно сохранить юзера в Базу Данных (Prisma/Mongoose)
    // await saveUserToDb(user)

    // 4. Возвращаем ответ фронту
    return {
        success: true,
        user: {
            id: user.id,
            name: user.first_name,
            isPremium: user.is_premium
        },
        message: 'Вы успешно авторизованы на сервере Nuxt!'
    }
})