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
			'connect', 'disconnect', 'error',
			'signal:volatility', 'signal:volatilityRange',
			'volatilitySpike', 'volatilityRange',
			'volumeSpike', 'priceChange',
			'top:gainers', 'top:losers',
			'top:gainers:5min', 'top:losers:5min',
			'top:volume:5min', 'top:funding:5min',
			'top:gainers:1h', 'top:losers:1h',
			'top:gainers:4h', 'top:losers:4h',
			'top:gainers:24h', 'top:losers:24h',
			'trigger:gainers-1h', 'trigger:losers-1h',
			'trigger:gainers-4h', 'trigger:losers-4h',
			'trigger:gainers-24h', 'trigger:losers-24h',
			'trigger:gainers-5min', 'trigger:losers-5min',
			'trigger:volume-5min', 'trigger:funding-5min',
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
			return
		}

		this.clearReconnectTimeout()
		this.active = true

		try {
			this.socket = new WebSocket(this.config.baseUrl)

			this.socket.onopen = () => {
				console.log('✅ WebSocket connected successfully')
				this.reconnectAttempts = 0
				this.emitEvent('connect')
			}

			this.socket.onmessage = (event) => {
				try {
					const message = JSON.parse(event.data)
					const { event: eventType, data } = message

					console.log(`Received ${eventType} event`, data)
					this.emitEvent(eventType, data)
				} catch (err) {
					console.error('Error parsing message:', err)
					this.emitEvent('error', new Error('Failed to parse WebSocket message'))
				}
			}

			this.socket.onclose = (event) => {
				const wasClean = event.wasClean ? 'clean' : 'unclean'
				console.log(`⚠️ WebSocket connection closed (${wasClean}, code: ${event.code})`)
				this.emitEvent('disconnect', { code: event.code, reason: event.reason })

				if (this.active && !event.wasClean) {
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
				this.tryReconnect()
			}
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