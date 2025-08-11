/**
 * Конфигурация Socket.IO
 * ------------------------------
 * Централизованная конфигурация для Socket.IO соединений
 * 
 * Этот модуль управляет настройками Socket.IO соединения
 * для различных окружений (разработка, продакшн, тестирование).
 * Предоставляет гибкую систему конфигурации с возможностью
 * переопределения через переменные окружения.
 */

/** URL-адреса Socket.IO по умолчанию для различных окружений */
const DEFAULT_URLS = {
	/** URL для окружения разработки */
	development: 'http://localhost:4200',
	/** URL для продакшн окружения */
	production: 'https://your-production-websocket-url.com',
	/** URL для тестового окружения */
	test: 'http://localhost:4201'
} as const

/**
 * Получить URL Socket.IO на основе текущего окружения
 * 
 * Функция сначала проверяет переменную окружения NEXT_PUBLIC_SOCKET_URL,
 * если она не установлена, использует URL по умолчанию для текущего
 * окружения (NODE_ENV). Автоматически конвертирует ws:// в http:// 
 * и wss:// в https:// для совместимости с Socket.IO.
 * 
 * @returns URL Socket.IO сервера
 */
export const getWebSocketUrl = (): string => {
	// Сначала пытаемся получить URL из переменной окружения
	let envUrl = process.env.NEXT_PUBLIC_SOCKET_URL
	if (envUrl) {
		// Конвертируем WebSocket URL в HTTP URL для Socket.IO
		envUrl = envUrl.replace('ws://', 'http://').replace('wss://', 'https://')
		return envUrl
	}

	// Используем URL по умолчанию на основе NODE_ENV
	const env = process.env.NODE_ENV as keyof typeof DEFAULT_URLS
	return DEFAULT_URLS[env] || DEFAULT_URLS.development
}

/**
 * Конфигурация Socket.IO соединения
 * 
 * Объект содержит все основные параметры для настройки
 * Socket.IO соединения, включая URL, таймауты и лимиты
 * переподключения.
 */
export const WEBSOCKET_CONFIG = {
	/** URL Socket.IO сервера */
	url: getWebSocketUrl(),
	/** Максимальное количество попыток переподключения */
	maxReconnectAttempts: 15,
	/** Задержка между попытками переподключения (мс) */
	reconnectDelay: 5000,
	/** Интервал отправки ping сообщений (мс) */
	pingInterval: 30000, // 30 секунд
	/** Таймаут соединения (мс) */
	connectionTimeout: 10000, // 10 секунд
} as const

/**
 * Логирование текущей конфигурации Socket.IO
 * 
 * Выводит в консоль текущие настройки Socket.IO соединения
 * для отладки и мониторинга. Полезно для диагностики
 * проблем с подключением.
 */
export const logWebSocketConfig = () => {
	console.log('🔧 Конфигурация Socket.IO:', {
		url: WEBSOCKET_CONFIG.url,
		environment: process.env.NODE_ENV || 'development',
		maxReconnectAttempts: WEBSOCKET_CONFIG.maxReconnectAttempts,
		reconnectDelay: WEBSOCKET_CONFIG.reconnectDelay,
		pingInterval: WEBSOCKET_CONFIG.pingInterval
	})
} 