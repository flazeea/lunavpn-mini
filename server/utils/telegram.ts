// server/utils/telegram.ts
import crypto from 'node:crypto'

export function verifyTelegramWebAppData(telegramInitData: string, botToken: string): boolean {
    const urlParams = new URLSearchParams(telegramInitData)
    const hash = urlParams.get('hash')

    urlParams.delete('hash')

    // Сортируем параметры по алфавиту
    const paramsList = Array.from(urlParams.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)

    const dataCheckString = paramsList.join('\n')

    // Создаем секретный ключ на основе токена бота
    const secretKey = crypto
        .createHmac('sha256', 'WebAppData')
        .update(botToken)
        .digest()

    // Хешируем нашу строку данных
    const calculatedHash = crypto
        .createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex')

    return calculatedHash === hash
}