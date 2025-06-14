/**
 * Сервис WebSocket
 * ------------------------------
 * Сервис, управляющий WebSocket-соединением с бэкендом
 * и отправляющий события в Redux-хранилище.
 * 
 * Основные функции:
 * - Установка и поддержание WebSocket соединения
 * - Автоматическое переподключение при обрыве связи
 * - Система пинг-понг для проверки активности соединения
 * - Обработка различных типов торговых сигналов
 * - Управление подписками на события
 */
'use client'

import { WEBSOCKET_CONFIG, logWebSocketConfig } from '@/config/websocket.config'

// Конфигурация WebSocket соединения
const SOCKET_URL = WEBSOCKET_CONFIG.url
const MAX_RECONNECT_ATTEMPTS = WEBSOCKET_CONFIG.maxReconnectAttempts
const RECONNECT_DELAY = WEBSOCKET_CONFIG.reconnectDelay
const PING_INTERVAL = WEBSOCKET_CONFIG.pingInterval

/**
 * Класс WebSocket клиента для обработки торговых сигналов
 * 
 * Реализует паттерн синглтон для обеспечения единого соединения
 * с сервером во всем приложении. Поддерживает автоматическое
 * переподключение и систему событий для подписки на различные
 * типы торговых данных.
 */
export class TradeSignalClient {
	/** Базовый URL WebSocket сервера */
	private baseUrl: string

	/** Экземпляр WebSocket соединения */
	private socket: WebSocket | null

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

	/** Таймер для переподключения */
	private connectTimer: NodeJS.Timeout | null = null

	/** Таймер для отправки ping сообщений */
	private pingTimer: NodeJS.Timeout | null = null

	/** Время последнего полученного pong сообщения */
	private lastPingTime: number = 0

	/** Флаг процесса подключения */
	private isConnecting: boolean = false

	/**
	 * Конструктор WebSocket клиента
	 * 
	 * @param baseUrl - URL WebSocket сервера (по умолчанию из конфигурации)
	 */
	constructor(baseUrl = SOCKET_URL) {
		console.log(`Инициализация WebSocket клиента с URL: ${baseUrl}`)
		logWebSocketConfig()

		this.baseUrl = baseUrl
		this.socket = null
		this.isConnected = false
		this.reconnectAttempts = 0
		this.maxReconnectAttempts = MAX_RECONNECT_ATTEMPTS
		this.reconnectDelay = RECONNECT_DELAY

		// Инициализация коллбэков для различных типов событий
		this.callbacks = {
			'top:gainers:5min': [], // Лучшие растущие за 5 минут
			'top:losers:5min': [], // Худшие падающие за 5 минут
			'top:volume:5min': [], // Топ по объему за 5 минут
			'top:funding:5min': [], // Топ по финансированию за 5 минут
			'top:gainers:24h': [], // Лучшие растущие за 24 часа
			'top:losers:24h': [], // Худшие падающие за 24 часа
			'signal:volatility': [], // Сигналы волатильности
			'signal:volatilityRange': [], // Сигналы диапазона волатильности
			'volatilitySpike': [], // Всплески волатильности
			'volatilityRange': [], // Диапазоны волатильности
			'volumeSpike': [], // Всплески объема
			'priceChange': [], // Изменения цены
			'top:gainers': [], // Лучшие растущие (общие)
			'top:losers': [], // Худшие падающие (общие)
			'trigger:gainers-24h': [], // Триггер для растущих за 24 часа
			'trigger:losers-24h': [], // Триггер для падающих за 24 часа
			'trigger:gainers-5min': [], // Триггер для растущих за 5 минут
			'trigger:losers-5min': [], // Триггер для падающих за 5 минут
			'trigger:volume-5min': [], // Триггер для объема за 5 минут
			'trigger:funding-5min': [], // Триггер для финансирования за 5 минут
			'connect': [], // Событие подключения
			'disconnect': [], // Событие отключения
			'error': [], // Событие ошибки
			'pong': [] // Событие ответа на пинг
		}
	}

	/**
	 * Подключиться к WebSocket серверу
	 * 
	 * Устанавливает соединение с WebSocket сервером и настраивает
	 * обработчики событий. Включает защиту от множественных попыток
	 * подключения и автоматическую очистку предыдущих соединений.
	 * 
	 * Особенности:
	 * - Предотвращает дублирование попыток подключения
	 * - Закрывает существующие соединения перед новым подключением
	 * - Настраивает систему ping-pong для контроля активности
	 * - Обрабатывает все типы WebSocket событий
	 */
	connect() {
		// Предотвращение множественных одновременных попыток подключения
		if (this.isConnecting) {
			console.log('Уже выполняется попытка подключения, игнорируем дублирующий запрос')
			return
		}

		// Если уже подключены и сокет открыт, ничего не делаем
		if (this.isConnected && this.socket && this.socket.readyState === WebSocket.OPEN) {
			console.log('WebSocket уже подключен, игнорируем дублирующий вызов connect')
			return
		}

		this.isConnecting = true

		// Очистка существующих таймеров
		if (this.connectTimer) {
			clearTimeout(this.connectTimer)
			this.connectTimer = null
		}

		if (this.pingTimer) {
			clearInterval(this.pingTimer)
			this.pingTimer = null
		}

		// Закрытие существующего соединения если оно есть
		if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
			console.log('Закрываем существующий сокет перед подключением')
			try {
				this.socket.close()
			} catch (err) {
				console.error('Ошибка при закрытии сокета:', err)
			}
			this.socket = null
		}

		try {
			console.log(`Подключение к WebSocket серверу по адресу ${this.baseUrl}...`)
			this.socket = new WebSocket(`${this.baseUrl}`)

			// Обработчик успешного подключения
			this.socket.onopen = () => {
				console.log('✅ WebSocket успешно подключен')
				this.isConnected = true
				this.isConnecting = false
				this.reconnectAttempts = 0
				this.lastPingTime = Date.now()
				this._startPingInterval()
				this._emitEvent('connect')
			}

			// Обработчик входящих сообщений
			this.socket.onmessage = (event) => {
				try {
					const message = JSON.parse(event.data)

					// Обработка pong сообщений для контроля активности
					if (message.type === 'pong') {
						this.lastPingTime = Date.now()
						this._emitEvent('pong', message)
						return
					}

					const { event: eventType, data } = message
					if (!eventType) {
						console.warn('Получено сообщение без типа события:', message)
						return
					}

					// Передача события подписчикам
					this._emitEvent(eventType, data)
				} catch (err) {
					console.error('Ошибка при разборе сообщения:', err)
					console.log('Сырые данные сообщения:', event.data)
				}
			}

			// Обработчик закрытия соединения
			this.socket.onclose = (event) => {
				console.log('⚠️ WebSocket соединение закрыто', {
					code: event.code,
					reason: event.reason,
					wasClean: event.wasClean
				})
				this.isConnected = false
				this.isConnecting = false
				this._emitEvent('disconnect')
				this._tryReconnect()
			}

			// Обработчик ошибок WebSocket
			this.socket.onerror = (error) => {
				// WebSocket события ошибок не предоставляют детальную информацию
				// Вместо этого логируем полезный контекст о состоянии соединения
				const errorInfo = {
					timestamp: new Date().toISOString(),
					readyState: this.socket?.readyState,
					readyStateText: this.socket?.readyState !== undefined ?
						['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][this.socket.readyState] : 'UNKNOWN',
					url: this.baseUrl,
					isConnecting: this.isConnecting,
					reconnectAttempts: this.reconnectAttempts,
					errorType: error?.type || 'unknown',
					errorTarget: error?.target?.constructor?.name || 'unknown'
				}

				console.error('❌ Произошла ошибка WebSocket:', errorInfo)

				// Логируем дополнительный контекст если доступен
				if (error instanceof Event) {
					console.error('❌ Детали события ошибки:', {
						type: error.type,
						timeStamp: error.timeStamp,
						isTrusted: error.isTrusted
					})
				}

				this.isConnecting = false
				this._emitEvent('error', {
					message: 'Ошибка WebSocket соединения',
					details: errorInfo
				})
			}
		} catch (error) {
			// Обработка ошибок при создании WebSocket соединения
			const errorInfo = {
				timestamp: new Date().toISOString(),
				url: this.baseUrl,
				isConnecting: this.isConnecting,
				reconnectAttempts: this.reconnectAttempts,
				errorMessage: error instanceof Error ? error.message : String(error),
				errorName: error instanceof Error ? error.name : 'Unknown',
				errorStack: error instanceof Error ? error.stack : undefined
			}

			console.error('❌ Ошибка при установке WebSocket соединения:', errorInfo)

			this.isConnecting = false
			this._emitEvent('error', {
				message: 'Не удалось установить WebSocket соединение',
				details: errorInfo
			})
			this._tryReconnect()
		}
	}

	/**
	 * Запуск интервала ping сообщений
	 * 
	 * Устанавливает периодическую отправку ping сообщений для
	 * контроля активности соединения. Если сервер не отвечает
	 * pong сообщениями в течение заданного времени, инициирует
	 * переподключение.
	 * 
	 * @private
	 */
	private _startPingInterval() {
		if (this.pingTimer) {
			clearInterval(this.pingTimer)
		}

		this.pingTimer = setInterval(() => {
			if (this.isActive()) {
				const timeSinceLastPing = Date.now() - this.lastPingTime
				if (timeSinceLastPing > PING_INTERVAL * 2) {
					console.warn('Слишком долго нет ответа pong, переподключаемся...')
					this.disconnect()
					this.connect()
					return
				}

				try {
					this.socket?.send(JSON.stringify({ type: 'ping' }))
				} catch (error) {
					console.error('Ошибка при отправке ping:', error)
				}
			}
		}, PING_INTERVAL)
	}

	/**
	 * Отключиться от WebSocket сервера
	 * 
	 * Корректно закрывает WebSocket соединение и очищает все
	 * связанные таймеры. Устанавливает флаги состояния в
	 * соответствующие значения.
	 */
	disconnect() {
		// Очистка таймеров
		if (this.connectTimer) {
			clearTimeout(this.connectTimer)
			this.connectTimer = null
		}

		if (this.pingTimer) {
			clearInterval(this.pingTimer)
			this.pingTimer = null
		}

		// Закрытие WebSocket соединения
		if (this.socket) {
			console.log('Отключение WebSocket...')
			this.socket.close()
			this.socket = null
			this.isConnected = false
		}
	}

	/**
	 * Попытаться переподключиться при потере соединения
	 * 
	 * Реализует логику автоматического переподключения с
	 * ограничением количества попыток. Использует фиксированную
	 * задержку между попытками для предотвращения перегрузки сервера.
	 * 
	 * @private
	 */
	private _tryReconnect() {
		if (this.reconnectAttempts < this.maxReconnectAttempts) {
			this.reconnectAttempts++
			console.log(
				`🔄 Попытка переподключения (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
			)

			// Очищаем существующий таймер, если есть
			if (this.connectTimer) {
				clearTimeout(this.connectTimer)
			}

			// Используем фиксированную задержку вместо увеличивающейся
			this.connectTimer = setTimeout(() => {
				this.connect()
				this.connectTimer = null
			}, this.reconnectDelay)
		} else {
			console.error('⛔ Достигнуто максимальное количество попыток переподключения. Проверьте соединение.')
			this._emitEvent('error', { message: 'Достигнуто максимальное количество попыток переподключения' })
		}
	}

	/**
	 * Подписаться на события WebSocket
	 * 
	 * Добавляет функцию обратного вызова для указанного типа события.
	 * Поддерживает множественные подписки на одно событие.
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
	 * Отписаться от событий WebSocket
	 * 
	 * Удаляет указанную функцию обратного вызова из списка
	 * подписчиков на событие.
	 * 
	 * @param eventName - Имя события
	 * @param callback - Функция обратного вызова для удаления
	 * @returns Экземпляр клиента для цепочки вызовов
	 */
	off(eventName: string, callback: Function) {
		if (this.callbacks[eventName]) {
			this.callbacks[eventName] = this.callbacks[eventName].filter(
				(cb) => cb !== callback
			)
		}
		return this
	}

	/**
	 * Проверить статус соединения
	 * 
	 * Возвращает true если WebSocket соединение активно и готово
	 * для отправки/получения данных.
	 * 
	 * @returns true если соединение активно, false в противном случае
	 */
	isActive(): boolean {
		return (
			this.isConnected &&
			this.socket !== null &&
			this.socket.readyState === WebSocket.OPEN
		)
	}

	/**
	 * Вызвать обработчики события
	 * 
	 * Безопасно вызывает все зарегистрированные обработчики
	 * для указанного события. Обрабатывает ошибки в коллбэках
	 * чтобы предотвратить падение всего приложения.
	 * 
	 * @param eventName - Имя события
	 * @param data - Данные события (опционально)
	 * @private
	 */
	private _emitEvent(eventName: string, data?: any) {
		if (this.callbacks[eventName]) {
			this.callbacks[eventName].forEach((callback) => {
				try {
					callback(data)
				} catch (err) {
					console.error(`Ошибка в коллбэке для события ${eventName}:`, err)
				}
			})
		}
	}
}

/** Экземпляр синглтона WebSocket клиента */
let wsClientInstance: TradeSignalClient | null = null

/**
 * Получить экземпляр WebSocket клиента (синглтон)
 * 
 * Реализует паттерн синглтон для обеспечения единого
 * WebSocket соединения во всем приложении. На стороне
 * сервера (SSR) возвращает фиктивный клиент.
 * 
 * @returns Экземпляр WebSocket клиента
 */
export const getWebSocketClient = (): TradeSignalClient => {
	if (typeof window !== 'undefined') {
		// Создаем экземпляр только на стороне клиента
		if (!wsClientInstance) {
			wsClientInstance = new TradeSignalClient()
		}
		return wsClientInstance
	}

	// Возвращаем фиктивный клиент для SSR
	return new TradeSignalClient()
} 