// 'use client' tells Next.js this hook runs in the browser
'use client'

/*******************************************************
 * useSignalSocket – React hook for subscribing to the
 * WebSocket server on the `/ws` endpoint.
 * ----------------------------------------------------
 * ▸ Подключается к BACKEND‑у по WebSocket.
 * ▸ Принимает множество типов событий (volatility,
 *   volumeSpike, priceChange, топ‑гейнеры/лузеры,
 *   а также кастомные «trigger»‑каналы для 1h/4h/24h).
 * ▸ Каждое событие сохраняется в соответствующее
 *   состояние (useState) с ограничением 100 записей
 *   (0‑я позиция – самая новая).
 * ▸ Возвращает объект SignalData для использования
 *   в UI‑компонентах (Dashboards / Tables / Charts).
 ******************************************************/

import { useSelector } from 'react-redux'

import {
	selectConnectionStatus,
	selectPriceChangeSignals,
	selectTimeframe24hData,
	selectTimeframe5minData,
	selectTrigger24hData,
	selectTrigger5minData,
	selectVolatilitySignals,
	selectVolumeSignals
} from '@/store/signals/selectors/signals.selectors'
import { useSignalSocketInitializer } from './useSignalSocketInitializer'

/**
 * Клиент для работы с WebSocket сигналами
 * Использует нативный WebSocket API браузера
 */
class TradeSignalClient {
	baseUrl: string
	socket: WebSocket | null
	isConnected: boolean
	reconnectAttempts: number
	maxReconnectAttempts: number
	reconnectDelay: number
	callbacks: Record<string, Function[]>

	constructor(baseUrl = 'ws://localhost:4200') {
		this.baseUrl = baseUrl
		this.socket = null
		this.isConnected = false
		this.reconnectAttempts = 0
		this.maxReconnectAttempts = 5
		this.reconnectDelay = 3000
		this.callbacks = {
			'top:gainers:5min': [],
			'top:losers:5min': [],
			'top:volume:5min': [],
			'top:funding:5min': [],
			'top:gainers:24h': [],
			'top:losers:24h': [],
			'signal:volatility': [],
			'signal:volatilityRange': [],
			'volatilitySpike': [],
			'volatilityRange': [],
			'volumeSpike': [],
			'priceChange': [],
			'top:gainers': [],
			'top:losers': [],
			'trigger:gainers-24h': [],
			'trigger:losers-24h': [],
			'trigger:gainers-5min': [],
			'trigger:losers-5min': [],
			'trigger:volume-5min': [],
			'trigger:funding-5min': [],
			'connect': [],
			'disconnect': [],
			'error': []
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
			// Подключение к WebSocket серверу
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
	 * Попытка переподключения при обрыве соединения
	 * @private
	 */
	_tryReconnect() {
		if (this.reconnectAttempts < this.maxReconnectAttempts) {
			this.reconnectAttempts++
			console.log(
				`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
			)

			setTimeout(() => {
				this.connect()
			}, this.reconnectDelay * this.reconnectAttempts) // Увеличиваем задержку с каждой попыткой
		} else {
			console.error(
				'⛔ Max reconnect attempts reached. Please check your connection.'
			)
		}
	}

	/**
	 * Подписаться на сигнал
	 * @param {string} eventName - Название события
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
	 * Отписаться от сигнала
	 * @param {string} eventName - Название события
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
	 * Проверить состояние соединения
	 * @returns {boolean} - true если соединение установлено
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
	 * @param {string} eventName - Название события
	 * @param {*} data - Данные события
	 * @private
	 */
	_emitEvent(eventName: string, data?: any) {
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

/**
 * URL WebSocket‑сервера берём из env‑переменной, чтобы
 * можно было легко переключать dev / prod окружения.
 */
const SOCKET_URL =
	process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:4200'

/**
 * Вспомогательный тип, чтобы TypeScript не ругался, когда
 * приходят данные произвольной формы (payload / coins / массив).
 */
type AnyObject = { [key: string]: any }

/**
 * useSignalSocket
 * ------------------------------
 * Hook for using signal data from Redux store
 * Compatible with existing code that used the previous useSignalSocket hook
 */
export const useSignalSocket = () => {
	// Initialize the socket connection
	useSignalSocketInitializer()

	// Get data from Redux selectors
	const connectionStatus = useSelector(selectConnectionStatus)
	const volatilitySignals = useSelector(selectVolatilitySignals)
	const volumeSignals = useSelector(selectVolumeSignals)
	const priceChangeSignals = useSelector(selectPriceChangeSignals)

	const timeframe5min = useSelector(selectTimeframe5minData)
	const timeframe24h = useSelector(selectTimeframe24hData)
	const trigger5min = useSelector(selectTrigger5minData)
	const trigger24h = useSelector(selectTrigger24hData)

	// Legacy interface structure for backward compatibility
	return {
		connectionStatus,
		volatilitySignals,
		volumeSignals,
		priceChangeSignals,

		// 5min timeframe data
		topGainers5min: timeframe5min.gainers,
		topLosers5min: timeframe5min.losers,
		topVolume5min: timeframe5min.volume,
		topFunding5min: timeframe5min.funding,

		// 24h timeframe data
		topGainers24h: timeframe24h.gainers,
		topLosers24h: timeframe24h.losers,

		// Trigger data 5min
		triggerGainers5min: trigger5min.gainers,
		triggerLosers5min: trigger5min.losers,
		triggerVolume5min: trigger5min.volume,
		triggerFunding5min: trigger5min.funding,

		// Trigger data 24h
		triggerGainers24h: trigger24h.gainers,
		triggerLosers24h: trigger24h.losers
	}
} 