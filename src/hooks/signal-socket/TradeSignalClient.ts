/**
 * Клиент для работы с WebSocket сигналами
 * Использует нативный WebSocket API браузера
 */
import { SignalType } from './types'

type EventCallback = (...args: any[]) => void

interface TradeSignalClientConfig {
	baseUrl: string
	maxReconnectAttempts: number
	reconnectDelay: number
}

export class TradeSignalClient {
	private socket: WebSocket | null = null;
	private events: Map<string | SignalType, Set<EventCallback>> = new Map();
	private config: TradeSignalClientConfig
	private reconnectAttempts = 0;
	private reconnectTimeout: NodeJS.Timeout | null = null;
	private active = false;

	constructor(config: TradeSignalClientConfig) {
		this.config = config
		this.initEvents()
	}

	/**
	 * Initialize the events map with empty event sets
	 */
	private initEvents(): void {
		const eventTypes = [
			'connect', 'disconnect', 'error', 'reconnecting',
			// Volatility signals
			'signal:volatility', 'signal:volatilityRange',
			'volatilitySpike', 'volatilityRange',
			// Volume and price signals
			'volumeSpike', 'priceChange',
			// Top gainers/losers
			'top:gainers', 'top:losers',
			// Top gainers/losers without specific timeframe
			'top:gainers:', 'top:losers:',
			// 5min timeframe data
			'top:gainers:5min', 'top:losers:5min',
			'top:volume:5min', 'top:funding:5min',
			// 1h timeframe data
			'top:gainers:1h', 'top:losers:1h',
			// 4h timeframe data
			'top:gainers:4h', 'top:losers:4h',
			// 24h timeframe data
			'top:gainers:24h', 'top:losers:24h',
			// Trigger events
			'trigger:gainers-1h', 'trigger:losers-1h',
			'trigger:gainers-4h', 'trigger:losers-4h',
			'trigger:gainers-24h', 'trigger:losers-24h',
			'trigger:gainers-5min', 'trigger:losers-5min',
			'trigger:volume-5min', 'trigger:funding-5min',
			// Special events from new API
			'timeframe5min',
			'timeframe1h',
			'timeframe4h',
			'timeframe24h',
			// Generic event types
			SignalType.Volatility,
			SignalType.Volume,
			SignalType.PriceChange,
			SignalType.Timeframe
		]

		for (const eventType of eventTypes) {
			this.events.set(eventType, new Set())
		}
	}

	/**
	 * Connect to the WebSocket server
	 */
	public connect(): void {
		if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
			console.log('WebSocket already connected or connecting')
			return
		}

		this.clearReconnectTimeout()
		this.active = true

		try {
			// Ensure baseUrl starts with ws:// or wss://
			let wsUrl = this.config.baseUrl
			if (!wsUrl.startsWith('ws://') && !wsUrl.startsWith('wss://')) {
				wsUrl = `ws://${wsUrl.replace(/^http(s)?:\/\//, '')}`
				console.log(`Converted URL to WebSocket protocol: ${wsUrl}`)
			}

			console.log(`Connecting to WebSocket server at: ${wsUrl}`)
			this.socket = new WebSocket(wsUrl)

			this.socket.onopen = () => {
				console.log('✅ WebSocket connected successfully')
				this.reconnectAttempts = 0
				this.emitEvent('connect')
			}

			this.socket.onmessage = (event) => {
				try {
					console.log('Raw WebSocket message received:', event.data)
					const message = JSON.parse(event.data)
					const { event: eventType, data } = message

					console.log(`Received WebSocket event: ${eventType}`, data)

					// Emit the specific event
					this.emitEvent(eventType, data)

					// Also map to the new enum types if applicable
					this.mapToGenericSignalType(eventType, data)
				} catch (parseError) {
					console.error('Error parsing message:', parseError)
					console.error('Raw message content:', event.data)
					this.emitEvent('error', new Error('Failed to parse WebSocket message'))
				}
			}

			this.socket.onclose = (event) => {
				const wasClean = event.wasClean ? 'clean' : 'unclean'
				console.log(`⚠️ WebSocket connection closed (${wasClean}, code: ${event.code})`)
				this.emitEvent('disconnect', { code: event.code, reason: event.reason })

				if (this.active && !event.wasClean) {
					this.emitEvent('reconnecting')
					this.tryReconnect()
				}
			}

			this.socket.onerror = (error) => {
				console.error('❌ WebSocket error:', error)
				this.emitEvent('error', error)
			}
		} catch (error) {
			console.error('❌ Error establishing WebSocket connection:', error)
			this.emitEvent('error', error)
			if (this.active) {
				this.emitEvent('reconnecting')
				this.tryReconnect()
			}
		}
	}

	/**
	 * Maps specific event types to generic signal types
	 */
	private mapToGenericSignalType(eventType: string, data: any): void {
		// Log all signal types for debugging
		console.log(`Mapping signal type: ${eventType}`, data)

		// Map volatility-related events
		if (eventType === 'volatilitySpike' ||
			eventType === 'volatilityRange' ||
			eventType === 'signal:volatility' ||
			eventType === 'signal:volatilityRange') {
			// Ensure the data has the correct type
			if (!data.type) {
				data.type = eventType
			}

			// Log before emitting volatility event
			console.log(`Emitting volatility signal with type: ${data.type}`, data)

			this.emitEvent(SignalType.Volatility, data)
		}

		// Map volume-related events
		if (eventType === 'volumeSpike') {
			this.emitEvent(SignalType.Volume, data)
		}

		// Map price change events
		if (eventType === 'priceChange') {
			this.emitEvent(SignalType.PriceChange, data)
		}

		// Map timeframe-related events
		if (eventType.includes('top:gainers') || eventType.includes('top:losers')) {
			this.emitEvent(SignalType.Timeframe, data)
		}

		// Map specific timeframe events to generic timeframe type
		if (eventType === 'timeframe5min' ||
			eventType === 'timeframe1h' ||
			eventType === 'timeframe4h' ||
			eventType === 'timeframe24h') {
			this.emitEvent(SignalType.Timeframe, data)
		}
	}

	/**
	 * Disconnect from the WebSocket server
	 */
	public disconnect(): void {
		this.active = false
		this.clearReconnectTimeout()

		if (this.socket) {
			this.socket.close(1000, 'Client disconnect')
			this.socket = null
		}
	}

	/**
	 * Clear the reconnect timeout
	 */
	private clearReconnectTimeout(): void {
		if (this.reconnectTimeout) {
			clearTimeout(this.reconnectTimeout)
			this.reconnectTimeout = null
		}
	}

	/**
	 * Try to reconnect to the WebSocket server
	 */
	private tryReconnect(): void {
		if (this.reconnectAttempts < this.config.maxReconnectAttempts) {
			this.reconnectAttempts++

			const delay = this.config.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1)
			console.log(
				`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.config.maxReconnectAttempts}) in ${delay}ms...`
			)

			this.reconnectTimeout = setTimeout(() => {
				if (this.active) {
					this.connect()
				}
			}, delay)
		} else {
			console.error('⛔ Max reconnect attempts reached. Please check your connection.')
			this.emitEvent('error', new Error('Max reconnect attempts reached'))
		}
	}

	/**
	 * Subscribe to a signal event
	 */
	public on(eventType: string | SignalType, callback: EventCallback): void {
		const callbacks = this.events.get(eventType) || new Set()
		callbacks.add(callback)
		this.events.set(eventType, callbacks)
	}

	/**
	 * Unsubscribe from a signal event
	 */
	public off(eventType: string | SignalType, callback: EventCallback): void {
		const callbacks = this.events.get(eventType)
		if (callbacks) {
			callbacks.delete(callback)
		}
	}

	/**
	 * Check if the socket is connected
	 */
	public isActive(): boolean {
		return this.socket !== null && this.socket.readyState === WebSocket.OPEN
	}

	/**
	 * Emit an event to all subscribed callbacks
	 */
	private emitEvent(eventType: string | SignalType, data?: any): void {
		const callbacks = this.events.get(eventType)
		if (callbacks) {
			for (const callback of callbacks) {
				try {
					callback(data)
				} catch (err) {
					console.error(`Error in callback for event ${String(eventType)}:`, err)
				}
			}
		}
	}
} 