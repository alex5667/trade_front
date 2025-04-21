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

import { useEffect, useRef, useState } from 'react'

import {
	PriceChangeSignal,
	SignalData,
	TimeframeCoin,
	TimeframeSignal,
	TopGainersSignal,
	TopLosersSignal,
	VolatilitySpikeSignal,
	VolumeSpikeSignal
} from '@/types/signal.types'

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
			'top:gainers:1h': [],
			'top:losers:1h': [],
			'top:gainers:4h': [],
			'top:losers:4h': [],
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
			'trigger:gainers-1h': [],
			'trigger:losers-1h': [],
			'trigger:gainers-4h': [],
			'trigger:losers-4h': [],
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

export function useSignalSocket(): SignalData & { connectionStatus: string } {
	/*********************************
	 * refs & state
	 *********************************/
	const clientRef = useRef<TradeSignalClient | null>(null)
	const reconnectAttemptsRef = useRef(0)

	// Connection status for UI feedback
	const [connectionStatus, setConnectionStatus] = useState<string>('connecting')

	// ▼ Основные массивы сигналов (ограничены 100 эл.)
	const [volatilitySpikes, setVolatilitySpikes] =
		useState<VolatilitySpikeSignal[]>([])
	const [volatilityRanges, setVolatilityRanges] =
		useState<VolatilitySpikeSignal[]>([])
	const [volumeSpikes, setVolumeSpikes] = useState<VolumeSpikeSignal[]>([])
	const [priceChanges, setPriceChanges] = useState<PriceChangeSignal[]>([])

	// ▼ Списки топ‑монет (только символы)
	const [topGainers, setTopGainers] = useState<string[]>([])
	const [topLosers, setTopLosers] = useState<string[]>([])

	// ▼ «Триггерные» списки по таймфреймам (1h / 4h / 24h)
	const [triggerGainers1h, setTriggerGainers1h] = useState<string[]>([])
	const [triggerLosers1h, setTriggerLosers1h] = useState<string[]>([])
	const [triggerGainers4h, setTriggerGainers4h] = useState<string[]>([])
	const [triggerLosers4h, setTriggerLosers4h] = useState<string[]>([])
	const [triggerGainers24h, setTriggerGainers24h] = useState<string[]>([])
	const [triggerLosers24h, setTriggerLosers24h] = useState<string[]>([])

	// ▼ Топ монеты по таймфреймам с данными об изменении
	const [topGainers1h, setTopGainers1h] = useState<TimeframeCoin[]>([])
	const [topGainers5min, setTopGainers5min] = useState<TimeframeCoin[]>([])
	const [topLosers1h, setTopLosers1h] = useState<TimeframeCoin[]>([])
	const [topLosers5min, setTopLosers5min] = useState<TimeframeCoin[]>([])
	const [topGainers4h, setTopGainers4h] = useState<TimeframeCoin[]>([])
	const [topLosers4h, setTopLosers4h] = useState<TimeframeCoin[]>([])
	const [topGainers24h, setTopGainers24h] = useState<TimeframeCoin[]>([])
	const [topLosers24h, setTopLosers24h] = useState<TimeframeCoin[]>([])
	const [topVolume5min, setTopVolume5min] = useState<TimeframeCoin[]>([])
	const [topFunding5min, setTopFunding5min] = useState<TimeframeCoin[]>([])
	/**
	 * push – универсальная функция добавления элемента
	 * в «скользящее» окно последних 100 записей.
	 */
	const push = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, item: T) => {
		setter(prev => [item, ...prev.slice(0, 99)])
	}

	/**
	 * setupClient - create and configure WebSocket connection
	 */
	const setupClient = () => {
		if (clientRef.current) {
			console.log('🔄 Cleaning up existing WebSocket connection')
			clientRef.current.disconnect()
			clientRef.current = null
		}

		setConnectionStatus('connecting')
		console.log('🚀 Connecting to WebSocket at:', SOCKET_URL)

		try {
			const client = new TradeSignalClient(SOCKET_URL)
			clientRef.current = client

			// Connection events
			client.on('connect', () => {
				console.log('✅ WebSocket connected')
				setConnectionStatus('connected')
				reconnectAttemptsRef.current = 0
			})

			client.on('disconnect', () => {
				console.log('⚠️ WebSocket disconnected')
				setConnectionStatus('disconnected')
			})

			client.on('error', (err: Error) => {
				console.error('❌ WebSocket error:', err)
				setConnectionStatus(`error: ${err?.message || 'unknown error'}`)
			})

			// 1. Волатильность (спайки)
			client.on('signal:volatility', (s: VolatilitySpikeSignal) => {
				if (s.type === 'volatilitySpike') push(setVolatilitySpikes, s)
			})
			client.on('volatility', (s: VolatilitySpikeSignal) => push(setVolatilitySpikes, s))
			client.on('volatilitySpike', (s: VolatilitySpikeSignal) => push(setVolatilitySpikes, s))

			// 2. Диапазон‑волатильность (high‑low range)
			client.on('signal:volatilityRange', (s: VolatilitySpikeSignal) => push(setVolatilityRanges, s))
			client.on('volatilityRange', (s: VolatilitySpikeSignal) => push(setVolatilityRanges, s))

			// 3. Объёмные всплески & изменения цены
			client.on('volumeSpike', (s: VolumeSpikeSignal) => push(setVolumeSpikes, s))
			client.on('priceChange', (s: PriceChangeSignal) => push(setPriceChanges, s))

			// 4. Топ‑гейнеры / лузеры (потенциально в разных форматах)
			client.on('top:gainers', (d: TopGainersSignal | string[] | AnyObject) => {
				setTopGainers(parseSymbols(d))
			})
			client.on('top:losers', (d: TopLosersSignal | string[] | AnyObject) => {
				setTopLosers(parseSymbols(d))
			})

			// 5. Таймфрейм-специфичные данные для 5-минутного таймфрейма
			client.on('top:gainers:5min', (d: AnyObject) => {
				setTopGainers5min(parseTimeframeCoins(d))
			})
			client.on('top:losers:5min', (d: AnyObject) => {
				setTopLosers5min(parseTimeframeCoins(d))
			})
			client.on('top:volume:5min', (d: AnyObject) => {
				setTopVolume5min(parseTimeframeCoins(d))
			})
			client.on('top:funding:5min', (d: AnyObject) => {
				setTopFunding5min(parseTimeframeCoins(d))
			})

			// Legacy event handlers - keep them for backwards compatibility
			client.on('trigger:gainers-5min', (d: TopGainersSignal | string[] | AnyObject) => {
				setTopGainers5min(parseTimeframeCoins(d))
			})
			client.on('trigger:losers-5min', (d: TopLosersSignal | string[] | AnyObject) => {
				setTopLosers5min(parseTimeframeCoins(d))
			})
			client.on('trigger:volume-5min', (d: TopGainersSignal | string[] | AnyObject) => {
				setTopVolume5min(parseTimeframeCoins(d))
			})
			client.on('trigger:funding-5min', (d: TopGainersSignal | string[] | AnyObject) => {
				setTopFunding5min(parseTimeframeCoins(d))
			})

			// 6. Триггер‑каналы для 1h / 4h / 24h (символы‑кандидаты)
			client.on('trigger:gainers-1h', (d: TopGainersSignal | string[] | AnyObject) => setTriggerGainers1h(parseSymbols(d)))
			client.on('trigger:losers-1h', (d: TopLosersSignal | string[] | AnyObject) => setTriggerLosers1h(parseSymbols(d)))

			client.on('trigger:gainers-4h', (d: TopGainersSignal | string[] | AnyObject) => setTriggerGainers4h(parseSymbols(d)))
			client.on('trigger:losers-4h', (d: TopLosersSignal | string[] | AnyObject) => setTriggerLosers4h(parseSymbols(d)))

			client.on('trigger:gainers-24h', (d: TopGainersSignal | string[] | AnyObject) => setTriggerGainers24h(parseSymbols(d)))
			client.on('trigger:losers-24h', (d: TopLosersSignal | string[] | AnyObject) => setTriggerLosers24h(parseSymbols(d)))

			// 7. Топ монеты по таймфреймам с изменениями
			client.on('top:gainers:1h', (data: TimeframeSignal | AnyObject) => {
				console.log('📈 Received top:gainers:1h:', data)
				setTopGainers1h(parseTimeframeCoins(data))
			})

			client.on('top:losers:1h', (data: TimeframeSignal | AnyObject) => {
				console.log('📉 Received top:losers:1h:', data)
				setTopLosers1h(parseTimeframeCoins(data))
			})

			client.on('top:gainers:4h', (data: TimeframeSignal | AnyObject) => {
				console.log('📈 Received top:gainers:4h:', data)
				setTopGainers4h(parseTimeframeCoins(data))
			})

			client.on('top:losers:4h', (data: TimeframeSignal | AnyObject) => {
				console.log('📉 Received top:losers:4h:', data)
				setTopLosers4h(parseTimeframeCoins(data))
			})

			client.on('top:gainers:24h', (data: TimeframeSignal | AnyObject) => {
				console.log('📈 Received top:gainers:24h:', data)
				setTopGainers24h(parseTimeframeCoins(data))
			})

			client.on('top:losers:24h', (data: TimeframeSignal | AnyObject) => {
				console.log('📉 Received top:losers:24h:', data)
				setTopLosers24h(parseTimeframeCoins(data))
			})

			// Connect to the WebSocket server
			client.connect()
		} catch (e: any) {
			console.error('❌ WebSocket initialization error:', e)
			setConnectionStatus(`init_error: ${e.message}`)
		}
	}

	// Initialize the WebSocket connection when the component mounts
	useEffect(() => {
		setupClient()

		// Cleanup when component unmounts
		return () => {
			if (clientRef.current) {
				console.log('🧹 Cleaning up WebSocket connection on unmount')
				clientRef.current.disconnect()
				clientRef.current = null
			}
		}
	}, []) // Empty dependency array to run only once on mount

	/*********************************
	 * Helpers
	 *********************************/
	/**
	 * Разбираем разнообразные форматы «топ‑монет» из бекенда:
	 * – массив строк
	 * – объект { payload: [...] }
	 * – объект { coins: [...] } где элемент может быть string | {symbol}
	 */
	const parseSymbols = (data: any): string[] => {
		if (data && typeof data === 'object' && 'payload' in data && Array.isArray(data.payload)) {
			return data.payload.map((item: any) =>
				typeof item === 'string' ? item : (item as AnyObject).symbol || ''
			)
		}
		if (Array.isArray(data)) {
			return data.map(item => (typeof item === 'string' ? item : (item as AnyObject).symbol || ''))
		}
		if (data && typeof data === 'object' && Array.isArray((data as AnyObject).coins)) {
			return (data as AnyObject).coins.map((c: any) => (typeof c === 'string' ? c : c.symbol))
		}
		return []
	}

	/**
	 * Разбираем формат таймфрейм-монет: { type, payload: [{symbol, change}], timeframe }
	 */
	const parseTimeframeCoins = (data: any): TimeframeCoin[] => {
		// If the incoming data is an object with a payload array (new format)
		if (data && data.type && data.payload && Array.isArray(data.payload)) {
			return data.payload.map((item: any) => {
				// Handle funding data (new format)
				if (data.type === 'top:funding:5min' && item.symbol && item.rate && item.change) {
					return {
						symbol: item.symbol,
						change: item.rate,
						value: parseFloat(item.change)
					}
				}

				// Handle volume data (new format)
				if (data.type === 'top:volume:5min' && item.symbol && item.volume) {
					return {
						symbol: item.symbol,
						change: item.change || '0',
						value: parseFloat(item.volume),
						volume: typeof item.volume === 'number'
							? item.volume.toString()
							: item.volume || '0',
						volumePercent: typeof item.volumePercent === 'number'
							? item.volumePercent.toFixed(2)
							: typeof item.volumePercent === 'string'
								? item.volumePercent
								: '0.00',
						volume2Percent: typeof item.volume2Level === 'number'
							? item.volume2Level.toString()
							: typeof item.volume2Level === 'string'
								? item.volume2Level
								: '0',
						volume5Percent: typeof item.volume5Level === 'number'
							? item.volume5Level.toString()
							: typeof item.volume5Level === 'string'
								? item.volume5Level
								: '0',
						volume10Percent: typeof item.volume10Level === 'number'
							? item.volume10Level.toString()
							: typeof item.volume10Level === 'string'
								? item.volume10Level
								: '0'
					}
				}

				// Handle price change data (new format)
				if (data.type === 'top:gainers:5min' && item.symbol && item.change) {
					return {
						symbol: item.symbol,
						change: item.change
					}
				}

				// Handle volume and funding data with Symbol/Value format (old format)
				if (item.Symbol && item.Value !== undefined) {
					return {
						symbol: item.Symbol,
						change: item.Value.toString(),
						value: item.Value
					}
				}

				// Handle traditional timeframe data
				return {
					symbol: item.symbol || '',
					change: item.change || '0'
				}
			})
		}

		// If the incoming data is a TimeframeSignal
		if (data && data.type && data.payload && Array.isArray(data.payload)) {
			return data.payload
		}

		// If it's already an array of TimeframeCoins
		if (Array.isArray(data)) {
			return data
		}

		// Default empty array
		return []
	}

	/*********************************
	 * Return state to the component
	 *********************************/
	return {
		volatilitySpikes,
		volatilityRanges,
		volumeSpikes,
		priceChanges,
		topGainers,
		topLosers,
		triggerGainers1h,
		triggerLosers1h,
		triggerGainers4h,
		triggerLosers4h,
		triggerGainers24h,
		triggerLosers24h,
		topGainers1h,
		topLosers1h,
		topGainers4h,
		topLosers4h,
		topGainers24h,
		topLosers24h,
		topVolume5min,
		topFunding5min,
		topGainers5min,
		topLosers5min,
		connectionStatus
	}
} 