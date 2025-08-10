/**
 * Сервис Socket.IO
 * ------------------------------
 * Сервис, управляющий Socket.IO соединением с бэкендом
 * и отправляющий события в Redux-хранилище.
 * 
 * Основные функции:
 * - Установка и поддержание Socket.IO соединения
 * - Автоматическое переподключение при обрыве связи
 * - Обработка различных типов торговых сигналов
 * - Управление подписками на события
 */
'use client'

import { logWebSocketConfig, WEBSOCKET_CONFIG } from '@/config/websocket.config'
import { io, Socket } from 'socket.io-client'

// Безопасный stringify для объектов ошибок с возможными циклическими ссылками
const getCircularReplacer = () => {
	const seen = new WeakSet()
	return (_key: string, value: any) => {
		if (typeof value === 'object' && value !== null) {
			if (seen.has(value)) return '[Circular]'
			seen.add(value)
		}
		return value
	}
}

const safeStringify = (value: unknown, space: number = 2) => {
	try {
		return JSON.stringify(value, getCircularReplacer(), space)
	} catch (_err) {
		return '[Unserializable]'
	}
}

// Конфигурация Socket.IO соединения
const SOCKET_URL = WEBSOCKET_CONFIG.url.replace('ws://', 'http://').replace('wss://', 'https://')
const MAX_RECONNECT_ATTEMPTS = WEBSOCKET_CONFIG.maxReconnectAttempts
const RECONNECT_DELAY = WEBSOCKET_CONFIG.reconnectDelay

/**
 * Класс Socket.IO клиента для обработки торговых сигналов
 * 
 * Реализует паттерн синглтон для обеспечения единого соединения
 * с сервером во всем приложении. Поддерживает автоматическое
 * переподключение и систему событий для подписки на различные
 * типы торговых данных.
 */
export class TradeSignalSocketIOClient {
	/** Базовый URL Socket.IO сервера */
	private baseUrl: string

	/** Экземпляр Socket.IO соединения */
	private socket: Socket | null

	/** Флаг состояния соединения */
	private isConnected: boolean

	/** Счетчик попыток переподключения */
	private reconnectAttempts: number

	/** Максимальное количество попыток переподключения */
	private maxReconnectAttempts: number

	/** Задержка между попытками переподключения (мс) */
	private reconnectDelay: number

	/** Объект с коллбэками для различных событий */
	private callbacks: Record<string, Function[]>

	/** Флаг процесса подключения */
	private isConnecting: boolean = false

	/**
	 * Конструктор Socket.IO клиента
	 * 
	 * @param baseUrl - URL Socket.IO сервера (по умолчанию из конфигурации)
	 */
	constructor(baseUrl = SOCKET_URL) {
		console.log(`Инициализация Socket.IO клиента с URL: ${baseUrl}`)
		logWebSocketConfig()

		this.baseUrl = baseUrl
		this.socket = null
		this.isConnected = false
		this.reconnectAttempts = 0
		this.maxReconnectAttempts = MAX_RECONNECT_ATTEMPTS
		this.reconnectDelay = RECONNECT_DELAY

		// Инициализация коллбэков для различных типов событий
		this.callbacks = {

			'signal:volatility': [], // Сигналы волатильности
			'signal:volatilityRange': [], // Сигналы диапазона волатильности
			'volatilitySpike': [], // Всплески волатильности
			'volatilityRange': [], // Диапазоны волатильности
			'volumeSpike': [], // Всплески объема
			'priceChange': [], // Изменения цены
			'top:gainers': [], // Лучшие растущие (общие)
			'top:losers': [], // Худшие падающие (общие)

			'connect': [], // Событие подключения
			'disconnect': [], // Событие отключения
			'error': [], // Событие ошибки
			'pong': [] // Событие ответа на пинг
		}
	}

	/**
	 * Подключиться к Socket.IO серверу
	 * 
	 * Устанавливает соединение с Socket.IO сервером и настраивает
	 * обработчики событий. Включает защиту от множественных попыток
	 * подключения и автоматическую очистку предыдущих соединений.
	 */
	connect() {
		// Предотвращение множественных одновременных попыток подключения
		if (this.isConnecting) {
			console.log('Уже выполняется попытка подключения, игнорируем дублирующий запрос')
			return
		}

		// Если уже подключены и сокет активен, ничего не делаем
		if (this.isConnected && this.socket && this.socket.connected) {
			console.log('Socket.IO уже подключен, игнорируем дублирующий вызов connect')
			return
		}

		this.isConnecting = true

		// Закрытие существующего соединения если оно есть
		if (this.socket) {
			console.log('Закрываем существующий Socket.IO сокет перед подключением')
			try {
				this.socket.disconnect()
			} catch (err) {
				console.error('Ошибка при закрытии Socket.IO сокета:', err)
			}
			this.socket = null
		}

		try {
			console.log(`Подключение к Socket.IO серверу по адресу ${this.baseUrl}...`)

			// Создаем Socket.IO соединение
			this.socket = io(this.baseUrl, {
				autoConnect: true,
				reconnection: true,
				reconnectionDelay: this.reconnectDelay,
				reconnectionDelayMax: this.reconnectDelay * 2,
				reconnectionAttempts: this.maxReconnectAttempts,
				timeout: 20000,
				transports: ['websocket', 'polling'],
				path: '/socket.io',
				withCredentials: true
			})

			// Обработчик успешного подключения
			this.socket.on('connect', () => {
				console.log('✅ Socket.IO успешно подключен, ID:', this.socket?.id)
				this.isConnected = true
				this.isConnecting = false
				this.reconnectAttempts = 0
				this._emitEvent('connect')
			})

			// Обработчик отключения
			this.socket.on('disconnect', (reason) => {
				console.log('⚠️ Socket.IO соединение закрыто, причина:', reason)
				this.isConnected = false
				this.isConnecting = false
				this._emitEvent('disconnect')
			})

			// Обработчик ошибок подключения
			this.socket.on('connect_error', (error: any) => {
				// Собираем диагностическую информацию без риска ошибок stringify
				const errorInfo = {
					timestamp: new Date().toISOString(),
					url: this.baseUrl,
					isConnecting: this.isConnecting,
					reconnectAttempts: this.reconnectAttempts,
					navigatorOnline: typeof navigator !== 'undefined' ? navigator.onLine : undefined,
					errorMessage: error?.message || String(error) || 'Unknown Socket.IO connection error',
					errorName: error?.name || error?.type || 'SocketError',
					errorCode: error?.code || (error?.data && error?.data.code) || 'UNKNOWN',
					errorDescription: error?.description || (error?.data && error?.data.description) || undefined,
					errorStack: error?.stack,
					errorRawType: Object.prototype.toString.call(error),
					errorStringified: safeStringify(error)
				}

				console.error('❌ Ошибка подключения Socket.IO:', errorInfo)
				console.error('❌ Socket.IO connect_error JSON:', safeStringify(errorInfo))

				this.isConnecting = false
				this._emitEvent('error', {
					message: 'Ошибка подключения Socket.IO',
					details: errorInfo
				})
			})

			// Обработчик pong ответов
			this.socket.on('pong', (data) => {
				console.log('📨 Получен pong от Socket.IO сервера:', data)
				this._emitEvent('pong', data)
			})

			// Настройка обработчиков для всех типов сигналов
			this._setupSignalHandlers()

		} catch (error) {
			// Обработка ошибок при создании Socket.IO соединения
			const errorInfo = {
				timestamp: new Date().toISOString(),
				url: this.baseUrl,
				isConnecting: this.isConnecting,
				reconnectAttempts: this.reconnectAttempts,
				errorMessage: error instanceof Error ? error.message : String(error),
				errorName: error instanceof Error ? error.name : 'Unknown',
				errorStack: error instanceof Error ? error.stack : undefined
			}

			console.error('❌ Ошибка при создании Socket.IO соединения:', errorInfo)

			this.isConnecting = false
			this._emitEvent('error', {
				message: 'Не удалось создать Socket.IO соединение',
				details: errorInfo
			})
		}
	}

	/**
	 * Настройка обработчиков для всех типов сигналов
	 * @private
	 */
	private _setupSignalHandlers() {
		if (!this.socket) return

		// Обработчики для всех типов событий сигналов
		const signalTypes = [
			'signal:volatility',
			'signal:volatilityRange',
			'volatilitySpike',
			'volatilityRange',
			'volumeSpike',
			'priceChange',
			'top:gainers',
			'top:losers',

		]

		signalTypes.forEach(signalType => {
			this.socket?.on(signalType, (data) => {
				console.log(`📨 Получен Socket.IO сигнал ${signalType}:`, data)
				this._emitEvent(signalType, data)
			})
		})

		// Дополнительно: подписываемся на имена каналов, совпадающие с Redis Streams
		// и транслируем их в уже используемые клиентом события (алиасы)
		const redisEventAliases: Record<string, string[]> = {
			'stream:top-gainers': ['top:gainers'],
			'stream:top-losers': ['top:losers'],
			'stream:volume-signals': ['volumeSpike', 'volume-signals'],
			'stream:funding-signals': ['funding', 'funding-signals'],
			'stream:volatility': ['signal:volatility', 'volatility', 'volatilitySpike'],
			'stream:volatilityRange': ['signal:volatilityRange', 'volatilityRange'],
			'stream:volatilitySpike': ['volatilitySpike']
		}

		Object.entries(redisEventAliases).forEach(([redisEvent, aliases]) => {
			this.socket?.on(redisEvent, (data) => {
				console.log(`📨 Получен Redis-канал ${redisEvent}:`, data)
				// Эмитим исходное имя события
				this._emitEvent(redisEvent, data)
				// И алиасы, которые уже слушает приложение
				aliases.forEach((alias) => this._emitEvent(alias, data))
			})
		})
	}

	/**
	 * Отключиться от Socket.IO сервера
	 */
	disconnect() {
		if (this.socket) {
			console.log('Отключение Socket.IO...')
			this.socket.disconnect()
			this.socket = null
			this.isConnected = false
		}
	}

	/**
	 * Подписка на события Socket.IO
	 * 
	 * @param eventName - Имя события для подписки
	 * @param callback - Функция обратного вызова
	 * @returns Экземпляр клиента для цепочки вызовов
	 */
	on(eventName: string, callback: Function) {
		if (!this.callbacks[eventName]) {
			this.callbacks[eventName] = []
		}
		this.callbacks[eventName].push(callback)
		return this
	}

	/**
	 * Отписка от событий Socket.IO
	 * 
	 * @param eventName - Имя события для отписки
	 * @param callback - Функция обратного вызова для удаления
	 * @returns Экземпляр клиента для цепочки вызовов
	 */
	off(eventName: string, callback: Function) {
		if (this.callbacks[eventName]) {
			this.callbacks[eventName] = this.callbacks[eventName].filter(cb => cb !== callback)
		}
		return this
	}

	/**
	 * Проверить статус соединения
	 * 
	 * @returns true если Socket.IO соединение активно
	 */
	isActive(): boolean {
		return this.isConnected && this.socket !== null && this.socket.connected
	}

	/**
	 * Отправить сообщение на сервер
	 * 
	 * @param eventName - Имя события
	 * @param data - Данные для отправки
	 */
	emit(eventName: string, data?: any) {
		if (this.socket && this.socket.connected) {
			this.socket.emit(eventName, data)
		} else {
			console.warn('Socket.IO не подключен, невозможно отправить сообщение:', eventName)
		}
	}

	/**
	 * Вспомогательный метод для отправки событий подписчикам
	 * 
	 * @param eventName - Имя события
	 * @param data - Данные события
	 * @private
	 */
	private _emitEvent(eventName: string, data?: any) {
		const callbacks = this.callbacks[eventName] || []
		callbacks.forEach(callback => {
			try {
				callback(data)
			} catch (error) {
				console.error(`Ошибка в коллбэке для события ${eventName}:`, error)
			}
		})
	}
}

/** Экземпляр синглтона Socket.IO клиента */
let socketIOClientInstance: TradeSignalSocketIOClient | null = null

/**
 * Получить экземпляр Socket.IO клиента (синглтон)
 * 
 * @returns Экземпляр Socket.IO клиента
 */
export const getSocketIOClient = (): TradeSignalSocketIOClient => {
	if (typeof window !== 'undefined') {
		// Создаем экземпляр только на стороне клиента
		if (!socketIOClientInstance) {
			socketIOClientInstance = new TradeSignalSocketIOClient()
		}
		return socketIOClientInstance
	}

	// Возвращаем фиктивный клиент для SSR
	return new TradeSignalSocketIOClient()
} 