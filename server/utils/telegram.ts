// server/utils/telegram.ts
import crypto from 'node:crypto'

interface ValidationResult {
    isValid: boolean
    data?: any
    error?: string
}

export function validateTelegramData(initData: string, botToken: string): ValidationResult {
    // 1. Если строка пустая — сразу отказ
    if (!initData) {
        return { isValid: false, error: 'No data provided' }
    }

    const urlParams = new URLSearchParams(initData)
    const hash = urlParams.get('hash')

    // 2. Если нет хеша — это не данные телеграма
    if (!hash) {
        return { isValid: false, error: 'No hash found' }
    }

    // 3. Убираем хеш из параметров для проверки
    urlParams.delete('hash')

    // 4. Сортировка параметров (обязательно алфавитный порядок ключей)
    const dataToCheck = Array.from(urlParams.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n')

    // 5. Создаем секретный ключ
    const secretKey = crypto
        .createHmac('sha256', 'WebAppData')
        .update(botToken)
        .digest()

    // 6. Считаем хеш
    const calculatedHash = crypto
        .createHmac('sha256', secretKey)
        .update(dataToCheck)
        .digest('hex')

    // 7. Проверяем срок действия (auth_date) - защита от Replay атак
    // Данные валидны только 24 часа (86400 секунд)
    const authDate = Number(urlParams.get('auth_date'))
    const now = Math.floor(Date.now() / 1000)

    if (now - authDate > 86400) {
        return { isValid: false, error: 'Data is expired' }
    }

    if (calculatedHash === hash) {
        // Парсим user JSON обратно в объект
        const userStr = urlParams.get('user')
        const user = userStr ? JSON.parse(userStr) : null
        return { isValid: true, data: user }
    } else {
        return { isValid: false, error: 'Signature mismatch' }
    }
}