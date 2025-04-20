// 'use client' tells Next.js this hook runs in the browser
'use client'

/*******************************************************
 * useSignalSocket – React hook for subscribing to the
 * Socket.IO server on the `/signals` namespace.
 * ----------------------------------------------------
 * ▸ Подключается к BACKEND‑у по WebSocket (Socket.IO).
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
import { io, Socket } from 'socket.io-client'

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
 * URL WebSocket‑сервера берём из env‑переменной, чтобы
 * можно было легко переключать dev / prod окружения.
 */
const SOCKET_URL =
	process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4200'

/**
 * Вспомогательный тип, чтобы TypeScript не ругался, когда
 * приходят данные произвольной формы (payload / coins / массив).
 */
type AnyObject = { [key: string]: any }

export function useSignalSocket(): SignalData & { connectionStatus: string } {
	/*********************************
	 * refs & state
	 *********************************/
	const socketRef = useRef<Socket | null>(null)
	const reconnectAttemptsRef = useRef(0)
	const maxReconnectAttempts = 10

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
	 * setupSocket - create and configure socket connection
	 */
	const setupSocket = () => {
		if (socketRef.current) {
			console.log('🔄 Cleaning up existing socket connection')
			socketRef.current.disconnect()
			socketRef.current = null
		}

		setConnectionStatus('connecting')
		console.log('🚀 Connecting to WebSocket at:', SOCKET_URL)

		try {
			// Check URL for transport preference
			let transports = ['polling', 'websocket'] // Default to polling first

			// In browser environment, check for URL parameters
			if (typeof window !== 'undefined') {
				const urlParams = new URLSearchParams(window.location.search)
				const transportParam = urlParams.get('transport')

				if (transportParam === 'polling') {
					transports = ['polling'] // Force polling only
					console.log('🔧 Using polling transport only (from URL parameter)')
				} else if (transportParam === 'websocket') {
					transports = ['websocket', 'polling'] // Try websocket first
					console.log('🔧 Using websocket transport with polling fallback (from URL parameter)')
				}
			}

			// Force polling first, then try WebSocket
			// This is more reliable in environments where WebSockets might be blocked
			const socket: Socket = io(`${SOCKET_URL}/signals`, {
				transports,
				reconnectionAttempts: maxReconnectAttempts,
				reconnectionDelay: 1000,
				reconnectionDelayMax: 5000,
				timeout: 30000, // Longer timeout for initial connection
				path: '/socket.io',
				forceNew: true,
				upgrade: true, // Allow transport upgrade
				rejectUnauthorized: false, // Allow self-signed certificates
			})

			socketRef.current = socket

			/* === Events for connection state === */
			socket.on('connect', () => {
				console.log('✅ WebSocket connected:', socket.id, 'Transport:', socket.io.engine.transport.name)
				setConnectionStatus('connected')
				reconnectAttemptsRef.current = 0

				// Log when transport changes (e.g., from polling to websocket)
				socket.io.engine.on('upgrade', () => {
					console.log('🔄 Transport upgraded to:', socket.io.engine.transport.name)
				})
			})

			socket.on('connect_error', err => {
				console.error('❌ Socket connection error:', err.name, err.message)
				setConnectionStatus(`error: ${err.message}`)

				// Try alternate connection approach if specific errors
				if (err.message.includes('websocket error') || err.message.includes('xhr poll error')) {
					console.log('⚠️ WebSocket connection failed, trying different transport options')

					// If current socket fails with websocket error, try reconnecting with polling only
					if (socketRef.current) {
						socketRef.current.io.opts.transports = ['polling']
						console.log('🔄 Forcing polling transport only')
					}
				}

				// Increment reconnect attempts
				reconnectAttemptsRef.current += 1

				if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
					console.error(`⛔ Maximum reconnection attempts (${maxReconnectAttempts}) reached. Please check your connection.`)
					setConnectionStatus('max_retries_reached')
				}
			})

			socket.on('disconnect', reason => {
				console.log('⚠️ Socket disconnected:', reason)
				setConnectionStatus(`disconnected: ${reason}`)

				// If not closed by client code, attempt manual reconnect
				if (reason === 'io server disconnect' || reason === 'transport close') {
					console.log('🔁 Attempting manual reconnect...')
					setTimeout(() => {
						if (socketRef.current) {
							socketRef.current.connect()
						}
					}, 2000)
				}
			})

			socket.io.on('reconnect', attempt => {
				console.log(`✅ Socket reconnected after ${attempt} attempts`)
				setConnectionStatus('connected')
			})

			socket.io.on('reconnect_attempt', attempt => {
				console.log(`🔄 Socket reconnection attempt ${attempt}/${maxReconnectAttempts}`)
				setConnectionStatus(`reconnecting: attempt ${attempt}/${maxReconnectAttempts}`)
			})

			socket.io.on('reconnect_error', error => {
				console.error('❌ Socket reconnection error:', error)
				setConnectionStatus(`reconnect_error: ${error.message}`)
			})

			socket.io.on('reconnect_failed', () => {
				console.error('⛔ Socket reconnection failed after all attempts')
				setConnectionStatus('reconnect_failed')
			})

			/* === Market‑signal handlers === */

			// 1. Волатильность (спайки)
			socket.on('signal:volatility', (s: VolatilitySpikeSignal) => {
				if (s.type === 'volatilitySpike') push(setVolatilitySpikes, s)
			})
			socket.on('volatility', (s: VolatilitySpikeSignal) => push(setVolatilitySpikes, s))
			socket.on('volatilitySpike', (s: VolatilitySpikeSignal) => push(setVolatilitySpikes, s))

			// 2. Диапазон‑волатильность (high‑low range)
			socket.on('signal:volatilityRange', (s: VolatilitySpikeSignal) => push(setVolatilityRanges, s))
			socket.on('volatilityRange', (s: VolatilitySpikeSignal) => push(setVolatilityRanges, s))

			// 3. Объёмные всплески & изменения цены
			socket.on('volumeSpike', (s: VolumeSpikeSignal) => push(setVolumeSpikes, s))
			socket.on('priceChange', (s: PriceChangeSignal) => push(setPriceChanges, s))

			// 4. Топ‑гейнеры / лузеры (потенциально в разных форматах)
			socket.on('top:gainers', (d: TopGainersSignal | string[] | AnyObject) => {
				setTopGainers(parseSymbols(d))
			})
			socket.on('top:losers', (d: TopLosersSignal | string[] | AnyObject) => {
				setTopLosers(parseSymbols(d))
			})

			// 5. Таймфрейм-специфичные данные для 5-минутного таймфрейма
			socket.on('top:gainers:5min', (d: AnyObject) => {
				setTopGainers5min(parseTimeframeCoins(d))
			})
			socket.on('top:losers:5min', (d: AnyObject) => {
				setTopLosers5min(parseTimeframeCoins(d))
			})
			socket.on('top:volume:5min', (d: AnyObject) => {
				setTopVolume5min(parseTimeframeCoins(d))
			})
			socket.on('top:funding:5min', (d: AnyObject) => {
				setTopFunding5min(parseTimeframeCoins(d))
			})

			// Legacy event handlers - keep them for backwards compatibility
			socket.on('trigger:gainers-5min', (d: TopGainersSignal | string[] | AnyObject) => {
				setTopGainers5min(parseTimeframeCoins(d))
			})
			socket.on('trigger:losers-5min', (d: TopLosersSignal | string[] | AnyObject) => {
				setTopLosers5min(parseTimeframeCoins(d))
			})
			socket.on('trigger:volume-5min', (d: TopGainersSignal | string[] | AnyObject) => {
				setTopVolume5min(parseTimeframeCoins(d))
			})
			socket.on('trigger:funding-5min', (d: TopGainersSignal | string[] | AnyObject) => {
				setTopFunding5min(parseTimeframeCoins(d))
			})

			// 6. Триггер‑каналы для 1h / 4h / 24h (символы‑кандидаты)
			socket.on('trigger:gainers-1h', d => setTriggerGainers1h(parseSymbols(d)))
			socket.on('trigger:losers-1h', d => setTriggerLosers1h(parseSymbols(d)))

			socket.on('trigger:gainers-4h', d => setTriggerGainers4h(parseSymbols(d)))
			socket.on('trigger:losers-4h', d => setTriggerLosers4h(parseSymbols(d)))

			socket.on('trigger:gainers-24h', d => setTriggerGainers24h(parseSymbols(d)))
			socket.on('trigger:losers-24h', d => setTriggerLosers24h(parseSymbols(d)))

			// 6. Топ монеты по таймфреймам с изменениями
			socket.on('top:gainers:1h', (data: TimeframeSignal | AnyObject) => {
				console.log('📈 Received top:gainers:1h:', data)
				setTopGainers1h(parseTimeframeCoins(data))
			})

			socket.on('top:losers:1h', (data: TimeframeSignal | AnyObject) => {
				console.log('📉 Received top:losers:1h:', data)
				setTopLosers1h(parseTimeframeCoins(data))
			})

			socket.on('top:gainers:4h', (data: TimeframeSignal | AnyObject) => {
				console.log('📈 Received top:gainers:4h:', data)
				setTopGainers4h(parseTimeframeCoins(data))
			})

			socket.on('top:losers:4h', (data: TimeframeSignal | AnyObject) => {
				console.log('📉 Received top:losers:4h:', data)
				setTopLosers4h(parseTimeframeCoins(data))
			})

			socket.on('top:gainers:24h', (data: TimeframeSignal | AnyObject) => {
				console.log('📈 Received top:gainers:24h:', data)
				setTopGainers24h(parseTimeframeCoins(data))
			})

			socket.on('top:losers:24h', (data: TimeframeSignal | AnyObject) => {
				console.log('📉 Received top:losers:24h:', data)
				setTopLosers24h(parseTimeframeCoins(data))
			})

			/**
			 * Legacy handler: если прилетает «сырой» kline‑объект
			 * от Binance, преобразуем в VolatilitySpikeSignal.
			 */
			socket.on('binance:kline', raw => {
				if (!raw?.k) return
				const k = raw.k
				const volatility = ((parseFloat(k.h) - parseFloat(k.l)) / parseFloat(k.o)) * 100

				const sig: VolatilitySpikeSignal = {
					type: 'volatilityRange',
					symbol: k.s,
					interval: k.i,
					open: parseFloat(k.o),
					high: parseFloat(k.h),
					low: parseFloat(k.l),
					close: parseFloat(k.c),
					volatility: +volatility.toFixed(2),
					timestamp: k.t,
				}
				push(setVolatilityRanges, sig)
			})
		} catch (e: any) {
			console.error('❌ Socket initialization error:', e)
			setConnectionStatus(`init_error: ${e.message}`)
		}
	}

	// Initialize the socket connection when the component mounts
	useEffect(() => {
		setupSocket()

		// Cleanup when component unmounts
		return () => {
			if (socketRef.current) {
				console.log('🧹 Cleaning up socket connection on unmount')
				socketRef.current.disconnect()
				socketRef.current = null
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
