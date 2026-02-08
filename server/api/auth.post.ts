// server/api/auth.post.ts
import { validateTelegramData } from '../utils/telegram'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const config = useRuntimeConfig()

    // Валидация
    const result = validateTelegramData(body.initData, config.telegramBotToken)

    if (!result.isValid) {
        throw createError({
            statusCode: 401,
            statusMessage: `Unauthorized: ${result.error}`
        })
    }

    return {
        success: true,
        user: result.data
    }
})