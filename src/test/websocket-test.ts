'use client'

import { getWebSocketClient } from '@/services/websocket.service'

/**
 * WebSocket тестовый клиент
 * ------------------------------
 * Простой клиент для тестирования WebSocket соединения
 * и получения торговых сигналов только для 24h таймфрейма
 */

const WEBSOCKET_URL = 'ws://localhost:3001'

// События для подписки (только 24h)
const EVENTS_TO_MONITOR = [
	'top:gainers:24h', 'top:losers:24h',
	'trigger:gainers-24h', 'trigger:losers-24h'
]

/**
 * Простой WebSocket клиент для тестирования
 */
class WebSocketTestClient {
	private ws: WebSocket | null = null
	private isConnected = false
	private reconnectAttempts = 0
	private maxReconnectAttempts = 5

	/**
	 * Подключение к WebSocket серверу
	 */
	connect() {
		try {
			console.log(`Подключение к ${WEBSOCKET_URL}...`)
			this.ws = new WebSocket(WEBSOCKET_URL)

			this.ws.onopen = () => {
				console.log('✅ WebSocket подключен')
				this.isConnected = true
				this.reconnectAttempts = 0
			}

			this.ws.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data)
					const eventType = data.event || data.type

					if (EVENTS_TO_MONITOR.includes(eventType)) {
						console.log(`📦 Получено событие: ${eventType}`, data.data)
					} else {
						console.log(`📬 Событие: ${eventType}`, data)
					}
				} catch (error) {
					console.error('Ошибка разбора сообщения:', error)
					console.log('Сырые данные:', event.data)
				}
			}

			this.ws.onclose = (event) => {
				console.log(`❌ WebSocket отключен: ${event.code} ${event.reason}`)
				this.isConnected = false
				this.reconnect()
			}

			this.ws.onerror = (error) => {
				console.error('❌ Ошибка WebSocket:', error)
			}
		} catch (error) {
			console.error('Ошибка при создании WebSocket:', error)
		}
	}

	/**
	 * Попытка переподключения
	 */
	private reconnect() {
		if (this.reconnectAttempts < this.maxReconnectAttempts) {
			this.reconnectAttempts++
			console.log(`🔄 Попытка переподключения ${this.reconnectAttempts}/${this.maxReconnectAttempts}`)
			setTimeout(() => this.connect(), 3000)
		} else {
			console.error('⛔ Превышено максимальное количество попыток переподключения')
		}
	}

	/**
	 * Отключение от сервера
	 */
	disconnect() {
		if (this.ws) {
			console.log('🔌 Отключение от WebSocket сервера')
			this.ws.close()
			this.ws = null
		}
	}

	/**
	 * Отправка тестового сообщения
	 */
	sendTest() {
		if (this.isConnected && this.ws) {
			const testMessage = {
				event: 'test',
				data: { message: 'Тестовое сообщение', timestamp: Date.now() }
			}
			this.ws.send(JSON.stringify(testMessage))
			console.log('📤 Отправлено тестовое сообщение')
		} else {
			console.warn('⚠️ WebSocket не подключен')
		}
	}

	/**
	 * Подписка на определенное событие
	 */
	subscribe(eventName: string) {
		if (this.isConnected && this.ws) {
			const subscribeMessage = {
				event: 'subscribe',
				data: { eventName }
			}
			this.ws.send(JSON.stringify(subscribeMessage))
			console.log(`📡 Подписка на событие: ${eventName}`)
		} else {
			console.warn('⚠️ WebSocket не подключен')
		}
	}

	/**
	 * Получение статуса соединения
	 */
	getStatus() {
		return {
			connected: this.isConnected,
			reconnectAttempts: this.reconnectAttempts,
			readyState: this.ws?.readyState
		}
	}
}

// Создание экземпляра клиента
const testClient = new WebSocketTestClient()

	// Функции для тестирования в консоли браузера
	; (window as any).wsTest = {
		connect: () => testClient.connect(),
		disconnect: () => testClient.disconnect(),
		status: () => console.log(testClient.getStatus()),
		sendTest: () => testClient.sendTest(),
		subscribe: (eventName: string) => testClient.subscribe(eventName),
		subscribeAll: () => {
			EVENTS_TO_MONITOR.forEach(event => testClient.subscribe(event))
		}
	}

console.log('WebSocket тестовый клиент готов. Используйте wsTest в консоли:')
console.log('- wsTest.connect() - подключиться')
console.log('- wsTest.disconnect() - отключиться')
console.log('- wsTest.status() - статус соединения')
console.log('- wsTest.sendTest() - отправить тест')
console.log('- wsTest.subscribe(eventName) - подписаться на событие')
console.log('- wsTest.subscribeAll() - подписаться на все события')

// Автоматическое подключение
testClient.connect()

/**
 * This function tests the WebSocket client functionality
 * by setting up event listeners and monitoring messages.
 */
export const testWebSocketClient = () => {
	console.log('Starting WebSocket client test...')

	// Get WebSocket client instance
	const client = getWebSocketClient()

	// Track test statistics
	const stats = {
		messagesReceived: 0,
		connectionAttempts: 0,
		errors: 0,
		eventTypes: {} as Record<string, number>
	}

	// Set up event listeners for various signal types
	const eventTypes = [
		'connect', 'disconnect', 'error', 'pong',
		'signal:volatility', 'volatilitySpike', 'volatilityRange',
		'volumeSpike', 'priceChange',
		'top:gainers:24h', 'top:losers:24h',
		'trigger:gainers-24h', 'trigger:losers-24h'
	]

	// Generic event handler for logging and stats
	const handleEvent = (eventName: string) => (data: any) => {
		stats.messagesReceived++

		// Track event type counts
		stats.eventTypes[eventName] = (stats.eventTypes[eventName] || 0) + 1

		console.log(`[WebSocket Test] Received ${eventName} event:`, data)
	}

	// Set up listeners for each event type
	eventTypes.forEach(eventType => {
		client.on(eventType, handleEvent(eventType))
	})

	// Special handlers for connection events
	client.on('connect', () => {
		console.log('[WebSocket Test] Connected to server')
	})

	client.on('disconnect', () => {
		console.log('[WebSocket Test] Disconnected from server')
		stats.connectionAttempts++
	})

	client.on('error', (error: Error | unknown) => {
		console.error('[WebSocket Test] Error:', error)
		stats.errors++
	})

	// Connect to the WebSocket server
	client.connect()

	// Set up interval to report statistics
	const statsInterval = setInterval(() => {
		console.log('\n[WebSocket Test] Statistics:')
		console.log('------------------------')
		console.log(`Messages received: ${stats.messagesReceived}`)
		console.log(`Connection attempts: ${stats.connectionAttempts}`)
		console.log(`Errors: ${stats.errors}`)
		console.log(`Connection status: ${client.isActive() ? 'Connected' : 'Disconnected'}`)
		console.log('\nEvent types received:')

		Object.entries(stats.eventTypes).forEach(([type, count]) => {
			console.log(`  ${type}: ${count}`)
		})

		console.log('------------------------\n')
	}, 10000)

	// Return a cleanup function
	return () => {
		console.log('[WebSocket Test] Cleaning up...')

		// Remove all event listeners
		eventTypes.forEach(eventType => {
			client.off(eventType, handleEvent(eventType))
		})

		// Disconnect client
		client.disconnect()

		// Clear stats interval
		clearInterval(statsInterval)

		console.log('[WebSocket Test] Cleanup complete')
	}
}

/**
 * Function to test WebSocket with a custom message handler
 */
export const testWebSocketWithHandler = (
	messageHandler: (eventType: string, data: any) => void,
	duration = 60000
) => {
	console.log(`Starting WebSocket test with custom handler for ${duration / 1000}s...`)

	// Get WebSocket client instance
	const client = getWebSocketClient()

	// Set up event listeners for various signal types
	const eventTypes = [
		'signal:volatility', 'volatilitySpike', 'volatilityRange',
		'volumeSpike', 'priceChange',
		'top:gainers:24h', 'top:losers:24h'
	]

	// Create handlers for each event type
	const handlers: Record<string, (data: any) => void> = {}

	eventTypes.forEach(eventType => {
		handlers[eventType] = (data: any) => {
			messageHandler(eventType, data)
		}

		// Attach the handler to the WebSocket client
		client.on(eventType, handlers[eventType])
	})

	// Connect to the WebSocket server
	client.connect()

	// Set up timeout to end test after specified duration
	const timeout = setTimeout(() => {
		console.log('[WebSocket Test] Test duration completed')
		cleanup()
	}, duration)

	// Cleanup function
	const cleanup = () => {
		// Remove all event listeners
		eventTypes.forEach(eventType => {
			client.off(eventType, handlers[eventType])
		})

		// Disconnect client
		client.disconnect()

		// Clear timeout
		clearTimeout(timeout)

		console.log('[WebSocket Test] Test complete')
	}

	// Return cleanup function so test can be stopped early
	return cleanup
}

/**
 * Function to test data consistency between events
 */
export const testDataConsistency = () => {
	console.log('Starting data consistency test...')

	// Tracking data structures
	const symbolData: Record<string, {
		volatility?: number,
		volume?: number,
		price?: number,
		percentChange?: number,
		lastUpdate: number
	}> = {}

	// Handler for all messages
	const handleMessage = (eventType: string, data: any) => {
		if (!data || !data.symbol) return

		const symbol = data.symbol
		const timestamp = data.timestamp || Date.now()

		// Initialize if symbol doesn't exist
		if (!symbolData[symbol]) {
			symbolData[symbol] = { lastUpdate: timestamp }
		}

		// Update data fields based on event type
		if (eventType.includes('volatility') && data.volatility) {
			symbolData[symbol].volatility = data.volatility
		}

		if (eventType.includes('volume') && data.volume) {
			symbolData[symbol].volume = data.volume
		}

		if (eventType.includes('price') && data.price) {
			symbolData[symbol].price = data.price
		}

		if ((eventType.includes('gainers') || eventType.includes('losers')) && data.percentChange) {
			symbolData[symbol].percentChange = data.percentChange
		}

		symbolData[symbol].lastUpdate = timestamp

		// Log the update
		console.log(`[Consistency] Updated ${symbol} from ${eventType}:`, symbolData[symbol])
	}

	// Start test with our custom handler
	const cleanup = testWebSocketWithHandler(handleMessage, 30000)

	// Return cleanup function
	return cleanup
} 