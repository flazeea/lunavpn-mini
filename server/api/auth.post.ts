// server/api/auth.post.ts
import { validateTelegramData } from '../utils/telegram'

export default defineEventHandler(async (event) => {
    // 1. Читаем тело запроса
    const body = await readBody(event)

    // ЛОГИРУЕМ ТО, ЧТО ПРИШЛО
    console.log('--------------------------------')
    console.log('INCOMING BODY:', typeof body, body)
    console.log('INCOMING INITDATA:', typeof body.initData, `"${body.initData}"`)
    console.log('--------------------------------')

    const config = useRuntimeConfig()

    // Валидация
    const result = validateTelegramData(body.initData, config.telegramBotToken)

    if (!result.isValid) {
        // Возвращаем ошибку с деталями, чтобы видеть её в Network вкладке браузера
        throw createError({
            statusCode: 401,
            statusMessage: `Unauthorized: ${result.error}`,
            data: { debug: body.initData } // Вернем обратно то, что прислали
        })
    }

    return {
        success: true,
        user: result.data
    }
})