import crypto from 'node:crypto'

interface ValidationResult {
    isValid: boolean
    data?: any
    error?: string
}

export function validateTelegramData(initData: string, botToken: string): ValidationResult {
    // Логируем, что пришло (потом уберете в продакшене)
    console.log('--- [Auth Debug] ---')

    if (!initData) {
        console.log('Error: initData is empty')
        return { isValid: false, error: 'No data provided' }
    }

    const urlParams = new URLSearchParams(initData)
    const hash = urlParams.get('hash')

    // Получаем дату авторизации
    const authDateStr = urlParams.get('auth_date')

    if (!hash) {
        console.log('Error: No hash found in initData')
        return { isValid: false, error: 'No hash found' }
    }

    if (!authDateStr) {
        console.log('Error: No auth_date found in initData')
        return { isValid: false, error: 'No auth_date found' }
    }

    // 1. Проверка времени (Самое важное место)
    const authDate = Number(authDateStr)
    const now = Math.floor(Date.now() / 1000) // Текущее время в секундах
    const diff = now - authDate

    console.log(`Time check: Now=${now}, AuthDate=${authDate}, Diff=${diff}s`)

    // Если данные старше 24 часов (86400 сек)
    if (diff > 86400) {
        console.log('Error: Data expired')
        return { isValid: false, error: 'Data is expired (older than 24h)' }
    }

    // Защита от "времени из будущего" (если часы сервера отстают)
    // Разрешаем расхождение в 5 минут (300 сек)
    if (diff < -300) {
        console.log('Error: Data from future (clock skew)')
        return { isValid: false, error: 'Data is from the future' }
    }

    // 2. Проверка подписи (Hash)
    urlParams.delete('hash')

    const dataToCheck = Array.from(urlParams.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n')

    const secretKey = crypto
        .createHmac('sha256', 'WebAppData')
        .update(botToken)
        .digest()

    const calculatedHash = crypto
        .createHmac('sha256', secretKey)
        .update(dataToCheck)
        .digest('hex')

    if (calculatedHash === hash) {
        console.log('Success: Signature matches')
        const userStr = urlParams.get('user')
        const user = userStr ? JSON.parse(userStr) : null
        return { isValid: true, data: user }
    } else {
        console.log(`Error: Hash mismatch. \nClient: ${hash} \nServer: ${calculatedHash}`)
        return { isValid: false, error: 'Signature mismatch' }
    }
}