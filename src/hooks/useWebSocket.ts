import { websocketService } from '@/services/websocket.service'
import { useEffect, useRef, useState } from 'react'

/**
 * Интерфейс для торгового сигнала
 */
export interface TradingSignal {
	type: string
	symbol?: string
	change?: number | string
	volatility?: number
	timeframe?: string
	payload?: any
	timestamp?: string
}

/**
 * Интерфейс для статуса соединения
 */
export interface ConnectionStatus {
	connected: boolean
	clientId?: string
	transport?: string
	url: string
	reconnectAttempts?: number
}

/**
 * React Hook для работы с WebSocket соединением
 * Обеспечивает подключение к trade_back и получение торговых сигналов
 */
export const useWebSocket = () => {
	const [isConnected, setIsConnected] = useState(false)
	const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
		connected: false,
		url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:4201'
	})
	const [lastSignal, setLastSignal] = useState<TradingSignal | null>(null)
	const [signalHistory, setSignalHistory] = useState<TradingSignal[]>([])
	const [error, setError] = useState<string | null>(null)

	// Refs для предотвращения повторных подключений
	const isConnecting = useRef(false)
	const subscriptionsRef = useRef<Map<string, (data: any) => void>>(new Map())

	/**
	 * Подключение к WebSocket
	 */
	const connect = async (): Promise<boolean> => {
		if (isConnecting.current || websocketService.isWebSocketConnected()) {
			return true
		}

		isConnecting.current = true
		setError(null)

		try {
			const success = await websocketService.connect()

			if (success) {
				setIsConnected(true)
				updateConnectionStatus()

				// Подписываемся на основные события
				setupSubscriptions()

				console.log('✅ WebSocket connected successfully in React hook')
			} else {
				setError('Failed to connect to WebSocket server')
				setIsConnected(false)
			}

			return success
		} catch (error) {
			console.error('WebSocket connection error:', error)
			setError(error instanceof Error ? error.message : 'Unknown connection error')
			setIsConnected(false)
			return false
		} finally {
			isConnecting.current = false
		}
	}

	/**
	 * Отключение от WebSocket
	 */
	const disconnect = (): void => {
		try {
			// Удаляем все подписки
			subscriptionsRef.current.forEach((callback, eventType) => {
				websocketService.unsubscribe(eventType, callback)
			})
			subscriptionsRef.current.clear()

			// Отключаемся от сервиса
			websocketService.disconnect()

			setIsConnected(false)
			setConnectionStatus(prev => ({ ...prev, connected: false, clientId: undefined }))

			console.log('🔌 Disconnected from WebSocket')
		} catch (error) {
			console.error('Error during disconnect:', error)
		}
	}

	/**
	 * Настройка подписок на события
	 */
	const setupSubscriptions = (): void => {
		// Общий обработчик для всех торговых сигналов
		const handleTradingSignal = (data: any) => {
			const signal: TradingSignal = {
				type: data.type || 'unknown',
				symbol: data.symbol || data.payload?.symbol,
				change: data.change || data.payload?.change,
				volatility: data.volatility || data.payload?.volatility,
				timeframe: data.timeframe,
				payload: data.payload || data,
				timestamp: data.timestamp || new Date().toISOString()
			}

			setLastSignal(signal)
			setSignalHistory(prev => [signal, ...prev.slice(0, 99)]) // Храним последние 100 сигналов
		}

		// Подписываемся на различные типы событий
		const eventTypes = [
			'volatility',
			'volatilityRange',
			'volatilitySpike',
			'top-gainers',
			'top-losers',
			'volume-signals',
			'funding-signals'
		]

		eventTypes.forEach(eventType => {
			const callback = (data: any) => {
				console.log(`📨 Received ${eventType} signal:`, data)
				handleTradingSignal({ ...data, type: eventType })
			}

			websocketService.subscribe(eventType, callback)
			subscriptionsRef.current.set(eventType, callback)
		})

		// Подписка на системные события
		const systemCallback = (data: any) => {
			console.log('❤️ System health check received:', data)
			updateConnectionStatus()
		}

		websocketService.subscribe('system-health', systemCallback)
		subscriptionsRef.current.set('system-health', systemCallback)
	}

	/**
	 * Обновление статуса соединения
	 */
	const updateConnectionStatus = (): void => {
		const stats = websocketService.getConnectionStats()
		setConnectionStatus({
			connected: stats.connected,
			clientId: stats.clientId,
			transport: stats.transport,
			url: stats.url
		})
	}

	/**
	 * Подписка на определенный тип событий
	 */
	const subscribe = (eventType: string, callback: (data: any) => void): (() => void) => {
		websocketService.subscribe(eventType, callback)

		// Возвращаем функцию отписки
		return () => {
			websocketService.unsubscribe(eventType, callback)
		}
	}

	/**
	 * Отправка сообщения на сервер
	 */
	const emit = (eventName: string, data: any): void => {
		websocketService.emit(eventName, data)
	}

	/**
	 * Получение статистики соединения
	 */
	const getStats = (): any => {
		return websocketService.getConnectionStats()
	}

	/**
	 * Очистка истории сигналов
	 */
	const clearSignalHistory = (): void => {
		setSignalHistory([])
		setLastSignal(null)
	}

	/**
	 * Автоматическое подключение при инициализации
	 */
	useEffect(() => {
		let mounted = true

		const autoConnect = async () => {
			if (mounted && !websocketService.isWebSocketConnected()) {
				await connect()
			}
		}

		autoConnect()

		// Cleanup при размонтировании
		return () => {
			mounted = false
			if (websocketService.isWebSocketConnected()) {
				disconnect()
			}
		}
	}, [])

	/**
	 * Периодическая проверка статуса соединения
	 */
	useEffect(() => {
		const interval = setInterval(() => {
			const connected = websocketService.isWebSocketConnected()
			if (connected !== isConnected) {
				setIsConnected(connected)
				updateConnectionStatus()
			}
		}, 5000) // Проверяем каждые 5 секунд

		return () => clearInterval(interval)
	}, [isConnected])

	return {
		// Состояние
		isConnected,
		connectionStatus,
		lastSignal,
		signalHistory,
		error,

		// Методы управления соединением
		connect,
		disconnect,

		// Методы для работы с событиями
		subscribe,
		emit,

		// Утилиты
		getStats,
		clearSignalHistory
	}
}

/**
 * Hook для подписки на определенный тип сигналов
 */
export const useSignalSubscription = (eventType: string, callback: (data: any) => void) => {
	useEffect(() => {
		const unsubscribe = websocketService.subscribe ?
			(() => {
				websocketService.subscribe(eventType, callback)
				return () => websocketService.unsubscribe(eventType, callback)
			})() :
			undefined

		return unsubscribe
	}, [eventType, callback])
}

/**
 * Hook для получения только топ-листов
 */
export const useTopLists = () => {
	const [topGainers, setTopGainers] = useState<any[]>([])
	const [topLosers, setTopLosers] = useState<any[]>([])
	const [lastUpdate, setLastUpdate] = useState<string | null>(null)

	useEffect(() => {
		const handleTopGainers = (data: any) => {
			setTopGainers(data.payload || data)
			setLastUpdate(new Date().toISOString())
		}

		const handleTopLosers = (data: any) => {
			setTopLosers(data.payload || data)
			setLastUpdate(new Date().toISOString())
		}

		websocketService.subscribe('top-gainers', handleTopGainers)
		websocketService.subscribe('top-losers', handleTopLosers)

		return () => {
			websocketService.unsubscribe('top-gainers', handleTopGainers)
			websocketService.unsubscribe('top-losers', handleTopLosers)
		}
	}, [])

	return {
		topGainers,
		topLosers,
		lastUpdate
	}
} 