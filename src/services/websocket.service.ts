import { io, Socket } from 'socket.io-client'

/**
 * WebSocket Service для подключения к trade_back
 * Обеспечивает получение торговых сигналов в реальном времени
 * 
 * ⚠️ ВАЖНО: Этот сервис подключается к WebSocket серверу Trade Back
 * на порту 4202 (НЕ на порту 4207, который используется для REST API).
 */
export class WebSocketService {
	private socket: Socket | null = null
	private reconnectAttempts = 0
	private maxReconnectAttempts = 5
	private isConnected = false
	private subscribers = new Map<string, Array<(data: any) => void>>()

	// Конфигурация подключения
	private readonly config = {
		url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:4202',
		options: {
			transports: ['websocket', 'polling'],
			timeout: 10000,
			reconnection: true,
			reconnectionAttempts: this.maxReconnectAttempts,
			reconnectionDelay: 1000,
			autoConnect: false
		}
	}

	/**
	 * Инициализация WebSocket соединения
	 */
	public async connect(): Promise<boolean> {
		if (this.socket?.connected) {
			console.log('🔌 WebSocket already connected')
			return true
		}

		try {
			console.log(`🔄 Connecting to WebSocket: ${this.config.url}`)

			this.socket = io(this.config.url, this.config.options)

			this.setupEventHandlers()
			this.socket.connect()

			return new Promise((resolve) => {
				const timeout = setTimeout(() => {
					console.log('❌ WebSocket connection timeout')
					resolve(false)
				}, 10000)

				this.socket?.on('connect', () => {
					clearTimeout(timeout)
					this.isConnected = true
					this.reconnectAttempts = 0
					console.log('✅ WebSocket connected successfully')
					resolve(true)
				})

				this.socket?.on('connect_error', (error) => {
					clearTimeout(timeout)
					console.log('❌ WebSocket connection error:', error)
					resolve(false)
				})
			})
		} catch (error) {
			console.log('❌ Failed to initialize WebSocket:', error)
			return false
		}
	}

	/**
	 * Настройка обработчиков событий
	 */
	private setupEventHandlers(): void {
		if (!this.socket) return

		// Успешное подключение
		this.socket.on('connect', () => {
			this.isConnected = true
			this.reconnectAttempts = 0
			console.log(`🟢 Connected to WebSocket server (ID: ${this.socket?.id})`)

			// Отправляем ping для проверки соединения
			this.socket?.emit('ping', {
				message: 'connection test from trade_front',
				timestamp: new Date().toISOString()
			})
		})

		// Отключение
		this.socket.on('disconnect', (reason) => {
			this.isConnected = false
			console.log(`🔴 WebSocket disconnected: ${reason}`)
		})

		// Ошибки соединения
		this.socket.on('connect_error', (error) => {
			this.isConnected = false
			this.reconnectAttempts++
			console.log(`❌ WebSocket connection error (attempt ${this.reconnectAttempts}):`, error)
		})

		// Ответ на ping
		this.socket.on('pong', (data) => {
			console.log('🏓 Received pong from server:', data)
		})

		// Торговые сигналы
		this.socket.on('trigger:volatility', (data) => {
			console.log('📊 Volatility signal:', data)
			this.notifySubscribers('volatility', data)
		})

		this.socket.on('trigger:volatilityRange', (data) => {
			console.log('📈 Volatility range signal:', data)
			this.notifySubscribers('volatilityRange', data)
		})

		this.socket.on('trigger:volatilitySpike', (data) => {
			console.log('⚡ Volatility spike signal:', data)
			this.notifySubscribers('volatilitySpike', data)
		})

		// Топ-листы (отключено: REST-only)
		// this.socket.on('top:gainers', (data) => {
		//   this.notifySubscribers('top-gainers', data)
		// })
		// this.socket.on('top:losers', (data) => {
		//   this.notifySubscribers('top-losers', data)
		// })

		// Объемы и сигналы финансирования (отключено: REST-only)
		// this.socket.on('trigger:volumeSignals', (data) => {
		//   this.notifySubscribers('volume-signals', data)
		// })
		// this.socket.on('trigger:fundingSignals', (data) => {
		//   this.notifySubscribers('funding-signals', data)
		// })

		// Системные события
		this.socket.on('system:health-check', (data) => {
			console.log('❤️ System health check:', data)
			this.notifySubscribers('system-health', data)
		})

		// Обработка всех остальных событий
		this.socket.onAny((eventName, data) => {
			if (!eventName.startsWith('connect') && !eventName.startsWith('disconnect') && eventName !== 'pong') {
				console.log(`📨 Received event [${eventName}]:`, data)
				this.notifySubscribers(eventName, data)
			}
		})
	}

	/**
	 * Подписка на определенный тип событий
	 */
	public subscribe(eventType: string, callback: (data: any) => void): void {
		if (!this.subscribers.has(eventType)) {
			this.subscribers.set(eventType, [])
		}
		this.subscribers.get(eventType)!.push(callback)
	}

	/**
	 * Отписка от событий
	 */
	public unsubscribe(eventType: string, callback: (data: any) => void): void {
		const subscribers = this.subscribers.get(eventType)
		if (subscribers) {
			const index = subscribers.indexOf(callback)
			if (index > -1) {
				subscribers.splice(index, 1)
			}
		}
	}

	/**
	 * Уведомление подписчиков
	 */
	private notifySubscribers(eventType: string, data: any): void {
		const subscribers = this.subscribers.get(eventType)
		if (subscribers) {
			subscribers.forEach(callback => {
				try {
					callback(data)
				} catch (error) {
					console.log(`Error in subscriber callback for ${eventType}:`, error)
				}
			})
		}
	}

	/**
	 * Отправка сообщения на сервер
	 */
	public emit(eventName: string, data: any): void {
		if (this.socket?.connected) {
			this.socket.emit(eventName, data)
		} else {
			console.warn('❌ WebSocket not connected, cannot emit event:', eventName)
		}
	}

	/**
	 * Отключение от WebSocket
	 */
	public disconnect(): void {
		if (this.socket) {
			console.log('🔌 Disconnecting from WebSocket')
			this.socket.disconnect()
			this.socket = null
			this.isConnected = false
		}
	}

	/**
	 * Проверка статуса соединения
	 */
	public isWebSocketConnected(): boolean {
		return this.isConnected && this.socket?.connected === true
	}

	/**
	 * Получение ID клиента
	 */
	public getClientId(): string | undefined {
		return this.socket?.id
	}

	/**
	 * Получение статистики соединения
	 */
	public getConnectionStats(): any {
		return {
			connected: this.isConnected,
			clientId: this.socket?.id,
			transport: this.socket?.io.engine.transport.name,
			subscribersCount: Array.from(this.subscribers.values()).reduce((sum, subs) => sum + subs.length, 0),
			url: this.config.url
		}
	}
}

// Создаем singleton экземпляр сервиса
export const websocketService = new WebSocketService() 