/**
 * Хук для получения данных Market Regime через WebSocket с поддержкой подписок
 * ------------------------------
 * Расширенная версия useRegimeSocket с возможностью подписки на конкретные
 * символы и таймфреймы. Позволяет динамически управлять подписками.
 * 
 * ВАЖНО: Подключается к корневому namespace (root), не к /signals
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { Socket, io } from 'socket.io-client'

import { WEBSOCKET_CONFIG } from '@/config/websocket.config'
import { RegimeSignal } from '@/types/signal.types'

/**
 * Интерфейс подписки на режимы
 */
export interface RegimeSubscription {
	symbols: string[]
	timeframes: string[]
}

/**
 * Данные обновления режима
 */
export interface RegimeUpdateData extends RegimeSignal {
	symbol: string
	timeframe: string
}

/**
 * Ответ при успешной подписке
 */
interface RegimeSubscribedResponse {
	symbols: string[]
	timeframes: string[]
	rooms: string[]
	timestamp: string
}

/**
 * Ответ при подключении
 */
interface RegimeConnectedResponse {
	clientId: string
	subscription: RegimeSubscription
	timestamp: string
}

/**
 * Ответ с ошибкой
 */
interface RegimeErrorResponse {
	message: string
	error?: string
}

/**
 * Возвращаемые данные хука
 */
interface UseRegimeSocketSubscriptionReturn {
	socket: Socket | null
	regimes: Map<string, RegimeUpdateData>
	latestRegime: RegimeUpdateData | null
	isConnected: boolean
	subscription: RegimeSubscription | null
	subscribe: (symbols: string[], timeframes: string[]) => void
	unsubscribe: () => void
	getRegime: (symbol: string, timeframe: string) => RegimeUpdateData | null
	error: string | null
}

/**
 * Получить ключ для хранения данных режима
 */
const getRegimeKey = (symbol: string, timeframe: string): string => {
	return `${symbol}:${timeframe}`
}

/**
 * Хук для работы с Market Regime через WebSocket с подписками
 * 
 * @example
 * ```tsx
 * const { regimes, subscribe, isConnected } = useRegimeSocketSubscription()
 * 
 * useEffect(() => {
 *   subscribe(['BTCUSDT', 'ETHUSDT'], ['M15', 'H4'])
 * }, [])
 * 
 * const btcRegime = regimes.get('BTCUSDT:M15')
 * ```
 */
export const useRegimeSocketSubscription = (): UseRegimeSocketSubscriptionReturn => {
	const [socket, setSocket] = useState<Socket | null>(null)
	const [regimes, setRegimes] = useState<Map<string, RegimeUpdateData>>(new Map())
	const [latestRegime, setLatestRegime] = useState<RegimeUpdateData | null>(null)
	const [isConnected, setIsConnected] = useState<boolean>(false)
	const [subscription, setSubscription] = useState<RegimeSubscription | null>(null)
	const [error, setError] = useState<string | null>(null)

	const socketRef = useRef<Socket | null>(null)

	/**
	 * Инициализация Socket.IO соединения
	 */
	useEffect(() => {
		console.log('🔌 Initializing Regime WebSocket connection...')
		console.log('🔧 WebSocket URL:', WEBSOCKET_CONFIG.url)

		// Создаем Socket.IO подключение к root namespace (backend не использует /signals)
		const socketInstance = io(WEBSOCKET_CONFIG.url, {
			path: '/socket.io',
			transports: ['websocket', 'polling'],
			reconnection: true,
			reconnectionAttempts: WEBSOCKET_CONFIG.maxReconnectAttempts,
			reconnectionDelay: WEBSOCKET_CONFIG.reconnectDelay,
			timeout: WEBSOCKET_CONFIG.connectionTimeout,
			autoConnect: true,
			forceNew: false,
		})

		socketRef.current = socketInstance
		setSocket(socketInstance)

		// Обработчик подключения
		socketInstance.on('connect', () => {
			console.log('✅ Regime WebSocket connected successfully!')
			console.log('📡 Client ID:', socketInstance.id)
			console.log('🔗 Transport:', socketInstance.io.engine.transport.name)
			setIsConnected(true)
			setError(null)
		})

		// Обработчик успешного подключения с дефолтной подпиской
		socketInstance.on('regime:connected', (data: RegimeConnectedResponse) => {
			console.log('📡 Regime connected with default subscription:', data)
			setSubscription(data.subscription)
		})

		// Обработчик отключения
		socketInstance.on('disconnect', (reason: string) => {
			console.log('🔴 Regime WebSocket disconnected:', reason)
			setIsConnected(false)

			// Подробная информация о причине отключения
			if (reason === 'io server disconnect') {
				console.warn('⚠️ Server disconnected the client, will try to reconnect')
			} else if (reason === 'io client disconnect') {
				console.log('ℹ️ Client disconnected intentionally')
			} else {
				console.warn('⚠️ Unexpected disconnect reason:', reason)
			}
		})

		// Обработчик ошибок подключения
		socketInstance.on('connect_error', (err: Error) => {
			console.error('❌ Regime WebSocket connection error:')
			console.error('   Error type:', err.name)
			console.error('   Error message:', err.message)
			console.error('   Full error:', err)
			console.error('   Attempting to connect to:', WEBSOCKET_CONFIG.url)
			console.error('   Path:', '/socket.io')
			setIsConnected(false)
			setError(`Connection failed: ${err.message}. Please check if backend is running on port 4202.`)
		})

		// Обработчик общих ошибок
		socketInstance.on('regime:error', (data: RegimeErrorResponse) => {
			console.error('❌ Regime error:', data)
			setError(data.message)
		})

		// Обработчик ошибок Socket.IO
		socketInstance.on('error', (err: any) => {
			console.error('❌ Socket.IO error:', err)
			setError(`Socket error: ${err.message || err}`)
		})

		// Обработчик успешной подписки
		socketInstance.on('regime:subscribed', (data: RegimeSubscribedResponse) => {
			console.log('✅ Subscribed to regime updates:', data)
			setSubscription({
				symbols: data.symbols,
				timeframes: data.timeframes,
			})
			setError(null)
		})

		// Обработчик отписки
		socketInstance.on('regime:unsubscribed', () => {
			console.log('✅ Unsubscribed from regime updates')
			setSubscription(null)
		})

		// Слушаем событие 'regime:update' (новый формат)
		socketInstance.on('regime:update', (data: RegimeUpdateData) => {
			if (data.symbol && data.timeframe) {
				const key = getRegimeKey(data.symbol, data.timeframe)
				console.log(`📊 Regime update received: ${key} -> ${data.regime}`)

				setRegimes(prev => {
					const updated = new Map(prev)
					updated.set(key, data)
					return updated
				})
				setLatestRegime(data)
			}
		})

		// Legacy: слушаем старое событие 'regime' для обратной совместимости
		socketInstance.on('regime', (data: RegimeUpdateData) => {
			if (data.symbol && data.timeframe) {
				const key = getRegimeKey(data.symbol, data.timeframe)
				console.log(`📊 Regime legacy update: ${key} -> ${data.regime}`)

				setRegimes(prev => {
					const updated = new Map(prev)
					updated.set(key, data)
					return updated
				})
				setLatestRegime(data)
			}
		})

		// Cleanup при размонтировании
		return () => {
			console.log('🔌 Cleaning up regime socket connection')
			socketInstance.off('connect')
			socketInstance.off('disconnect')
			socketInstance.off('connect_error')
			socketInstance.off('regime:error')
			socketInstance.off('regime:connected')
			socketInstance.off('regime:subscribed')
			socketInstance.off('regime:unsubscribed')
			socketInstance.off('regime:update')
			socketInstance.off('regime')
			socketInstance.close()
			socketRef.current = null
		}
	}, [])

	/**
	 * Подписка на символы и таймфреймы
	 */
	const subscribe = useCallback((symbols: string[], timeframes: string[]) => {
		if (!socketRef.current || !socketRef.current.connected) {
			console.warn('⚠️ Cannot subscribe: socket not connected')
			setError('Socket not connected')
			return
		}

		if (symbols.length === 0) {
			console.warn('⚠️ Cannot subscribe: symbols array is empty')
			setError('Symbols array cannot be empty')
			return
		}

		if (timeframes.length === 0) {
			console.warn('⚠️ Cannot subscribe: timeframes array is empty')
			setError('Timeframes array cannot be empty')
			return
		}

		console.log(`📡 Subscribing to ${symbols.length} symbols x ${timeframes.length} timeframes`)
		socketRef.current.emit('regime:subscribe', { symbols, timeframes })
	}, [])

	/**
	 * Отписка от всех подписок
	 */
	const unsubscribe = useCallback(() => {
		if (!socketRef.current || !socketRef.current.connected) {
			console.warn('⚠️ Cannot unsubscribe: socket not connected')
			return
		}

		console.log('📡 Unsubscribing from all regime updates')
		socketRef.current.emit('regime:unsubscribe')
		setRegimes(new Map()) // Очищаем данные
		setLatestRegime(null)
	}, [])

	/**
	 * Получить режим для конкретного символа и таймфрейма
	 */
	const getRegime = useCallback((symbol: string, timeframe: string): RegimeUpdateData | null => {
		const key = getRegimeKey(symbol, timeframe)
		return regimes.get(key) || null
	}, [regimes])

	return {
		socket,
		regimes,
		latestRegime,
		isConnected,
		subscription,
		subscribe,
		unsubscribe,
		getRegime,
		error,
	}
}

