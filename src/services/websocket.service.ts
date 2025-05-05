/**
 * WebSocket Service
 * ------------------------------
 * Сервис, управляющий WebSocket-соединением с бэкендом
 * и отправляющий события в Redux-хранилище.
 */
'use client'

// Конфигурация
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:4200'
const MAX_RECONNECT_ATTEMPTS = 15
const RECONNECT_DELAY = 5000

/**
 * WebSocket клиент для обработки торговых сигналов
 */
export class TradeSignalClient {
	private baseUrl: string
	private socket: WebSocket | null
	private isConnected: boolean
	private reconnectAttempts: number
	private maxReconnectAttempts: number
	private reconnectDelay: number
	private callbacks: Record<string, Function[]>

	constructor(baseUrl = SOCKET_URL) {
		this.baseUrl = baseUrl
		this.socket = null
		this.isConnected = false
		this.reconnectAttempts = 0
		this.maxReconnectAttempts = MAX_RECONNECT_ATTEMPTS
		this.reconnectDelay = RECONNECT_DELAY
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
			'error': [] // Событие ошибки
		}
	}

	/**
	 * Подключиться к WebSocket серверу
	 */
	connect() {
		if (this.socket) {
			console.log('Socket already exists, closing previous connection')
			this.socket.close()
		}

		try {
			this.socket = new WebSocket(`${this.baseUrl}`)

			this.socket.onopen = () => {
				console.log('✅ WebSocket connected successfully')
				this.isConnected = true
				this.reconnectAttempts = 0
				this._emitEvent('connect')
			}

			this.socket.onmessage = (event) => {
				try {
					const message = JSON.parse(event.data)
					const { event: eventType, data } = message

					console.log(`Received ${eventType} event`, data)
					this._emitEvent(eventType, data)
				} catch (err) {
					console.error('Error parsing message:', err)
				}
			}

			this.socket.onclose = (event) => {
				console.log('⚠️ WebSocket connection closed', event)
				this.isConnected = false
				this._emitEvent('disconnect')
				this._tryReconnect()
			}

			this.socket.onerror = (error) => {
				console.error('❌ WebSocket error:', error)
				this._emitEvent('error', error)
			}
		} catch (error) {
			console.error('❌ Error establishing WebSocket connection:', error)
			this._emitEvent('error', error)
			this._tryReconnect()
		}
	}

	/**
	 * Отключиться от WebSocket сервера
	 */
	disconnect() {
		if (this.socket) {
			this.socket.close()
			this.socket = null
			this.isConnected = false
		}
	}

	/**
	 * Попытаться переподключиться при потере соединения
	 */
	private _tryReconnect() {
		if (this.reconnectAttempts < this.maxReconnectAttempts) {
			this.reconnectAttempts++
			console.log(
				`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
			)

			// Используем фиксированную задержку вместо увеличивающейся
			setTimeout(() => {
				this.connect()
			}, this.reconnectDelay)
		} else {
			console.error('⛔ Max reconnect attempts reached. Please check your connection.')
		}
	}

	/**
	 * Подписаться на сигналы
	 * @param {string} eventName - Имя события
	 * @param {Function} callback - Функция обратного вызова
	 */
	on(eventName: string, callback: Function) {
		if (!this.callbacks[eventName]) {
			this.callbacks[eventName] = []
		}
		this.callbacks[eventName].push(callback)
		return this
	}

	/**
	 * Отписаться от сигналов
	 * @param {string} eventName - Имя события
	 * @param {Function} callback - Функция обратного вызова
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
	 * @returns {boolean} - true, если соединение активно
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
	 * @param {string} eventName - Имя события
	 * @param {any} data - Данные события
	 */
	private _emitEvent(eventName: string, data?: any) {
		if (this.callbacks[eventName]) {
			this.callbacks[eventName].forEach((callback) => {
				try {
					callback(data)
				} catch (err) {
					console.error(`Error in callback for event ${eventName}:`, err)
				}
			})
		}
	}
}

// Экземпляр синглтона
let wsClientInstance: TradeSignalClient | null = null

/**
 * Получить экземпляр WebSocket клиента (синглтон)
 */
export const getWebSocketClient = (): TradeSignalClient => {
	if (!wsClientInstance) {
		wsClientInstance = new TradeSignalClient()
	}
	return wsClientInstance
} 