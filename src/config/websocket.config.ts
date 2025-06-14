/**
 * Конфигурация WebSocket
 * ------------------------------
 * Централизованная конфигурация для WebSocket соединений
 * 
 * Этот модуль управляет настройками WebSocket соединения
 * для различных окружений (разработка, продакшн, тестирование).
 * Предоставляет гибкую систему конфигурации с возможностью
 * переопределения через переменные окружения.
 */

/** URL-адреса WebSocket по умолчанию для различных окружений */
const DEFAULT_URLS = {
	/** URL для окружения разработки */
	development: 'ws://127.0.0.1:4200',
	/** URL для продакшн окружения */
	production: 'wss://your-production-websocket-url.com',
	/** URL для тестового окружения */
	test: 'ws://localhost:4200'
} as const

/**
 * Получить URL WebSocket на основе текущего окружения
 * 
 * Функция сначала проверяет переменную окружения NEXT_PUBLIC_SOCKET_URL,
 * если она не установлена, использует URL по умолчанию для текущего
 * окружения (NODE_ENV).
 * 
 * @returns URL WebSocket сервера
 */
export const getWebSocketUrl = (): string => {
	// Сначала пытаемся получить URL из переменной окружения
	const envUrl = process.env.NEXT_PUBLIC_SOCKET_URL
	if (envUrl) {
		return envUrl
	}

	// Используем URL по умолчанию на основе NODE_ENV
	const env = process.env.NODE_ENV as keyof typeof DEFAULT_URLS
	return DEFAULT_URLS[env] || DEFAULT_URLS.development
}

/**
 * Конфигурация WebSocket соединения
 * 
 * Объект содержит все основные параметры для настройки
 * WebSocket соединения, включая URL, таймауты и лимиты
 * переподключения.
 */
export const WEBSOCKET_CONFIG = {
	/** URL WebSocket сервера */
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
 * Логирование текущей конфигурации WebSocket
 * 
 * Выводит в консоль текущие настройки WebSocket соединения
 * для отладки и мониторинга. Полезно для диагностики
 * проблем с подключением.
 */
export const logWebSocketConfig = () => {
	console.log('🔧 Конфигурация WebSocket:', {
		url: WEBSOCKET_CONFIG.url,
		environment: process.env.NODE_ENV || 'development',
		maxReconnectAttempts: WEBSOCKET_CONFIG.maxReconnectAttempts,
		reconnectDelay: WEBSOCKET_CONFIG.reconnectDelay,
		pingInterval: WEBSOCKET_CONFIG.pingInterval
	})
} 