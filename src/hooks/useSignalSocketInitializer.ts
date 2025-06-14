/**
 * Хук useSignalSocketInitializer
 * ------------------------------
 * Хук для инициализации WebSocket-соединения и настройки обработчиков
 * для разных типов торговых сигналов. Использует Redux для хранения
 * состояния соединения и сигналов.
 * 
 * Основные функции:
 * - Инициализация единого WebSocket соединения для всего приложения
 * - Настройка обработчиков для всех типов торговых сигналов
 * - Автоматическое переподключение при обрыве связи
 * - Распределение полученных данных по соответствующим Redux слайсам
 * - Обработка ошибок соединения и их логирование
 * - Управление жизненным циклом соединения
 */
'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { errorCatch } from '@/api/error'
import { getWebSocketClient } from '@/services/websocket.service'
import {
	FundingCoin,
	PriceChangeSignal,
	TimeframeCoin,
	VolatilitySignal,
	VolumeSignal
} from '@/store/signals/signal.types'

// Импорт действий из специализированных слайсов
import {
	setConnectionError,
	setConnectionStatus
} from '@/store/signals/slices/connection.slice'
import {
	addFundingData
} from '@/store/signals/slices/funding.slice'
import {
	addPriceChangeSignal
} from '@/store/signals/slices/price-change.slice'
import {
	addTimeframeGainer,
	addTimeframeLoser,
	addTimeframeVolume
} from '@/store/signals/slices/timeframe.slice'
import {
	addTriggerEvent
} from '@/store/signals/slices/trigger.slice'
import {
	addVolatilityRangeSignal
} from '@/store/signals/slices/volatility-range.slice'
import {
	addVolatilitySpikeSignal
} from '@/store/signals/slices/volatility-spike.slice'
import {
	addVolumeSignal
} from '@/store/signals/slices/volume.slice'

/**
 * Хук для инициализации WebSocket соединения и настройки обработчиков сигналов
 * 
 * Отвечает за подключение к серверу и распределение получаемых сигналов по Redux-стору.
 * Реализует паттерн "один раз инициализировать, использовать везде" для WebSocket соединения.
 * Автоматически обрабатывает переподключения и ошибки соединения.
 * 
 * Особенности:
 * - Предотвращает множественную инициализацию
 * - Автоматически переподключается при обрыве связи
 * - Распределяет сигналы по типам в соответствующие Redux слайсы
 * - Обрабатывает ошибки и логирует их для отладки
 * 
 * @returns null (хук не возвращает данные, только инициализирует соединение)
 */
export const useSignalSocketInitializer = () => {
	const dispatch = useDispatch()
	/** Флаг для предотвращения повторной инициализации */
	const initialized = useRef(false)
	/** Счетчик попыток подключения */
	const connectionAttempts = useRef(0)
	/** Максимальное количество попыток переподключения */
	const maxRetries = useRef(5)

	/**
	 * Обработчик изменения статуса соединения
	 * 
	 * Обновляет состояние соединения в Redux и логирует изменения
	 * для мониторинга состояния WebSocket соединения.
	 * 
	 * @param isConnected - Флаг состояния соединения
	 */
	const handleConnectionChange = useCallback(
		(isConnected: boolean) => {
			console.log(`Статус WebSocket соединения изменен: ${isConnected ? 'подключено' : 'отключено'}`)
			dispatch(setConnectionStatus(isConnected))
		},
		[dispatch]
	)

	/**
	 * Функция для инициализации WebSocket соединения
	 * 
	 * Создает WebSocket клиент и настраивает все необходимые обработчики
	 * событий для различных типов торговых сигналов. Обрабатывает события
	 * подключения, отключения и ошибок.
	 * 
	 * @returns Экземпляр WebSocket клиента
	 */
	const initializeSocketConnection = useCallback(() => {
		console.log('Инициализация WebSocket соединения...')
		const wsClient = getWebSocketClient()

		// Настраиваем обработчики событий
		wsClient
			// События подключения/отключения
			.on('connect', () => {
				console.log('WebSocket успешно подключен')
				handleConnectionChange(true)
			})
			.on('disconnect', () => {
				console.log('WebSocket отключен')
				handleConnectionChange(false)

				// Пытаемся переподключиться если отключились и не превысили лимит попыток
				if (connectionAttempts.current < maxRetries.current) {
					connectionAttempts.current += 1
					console.log(`Попытка переподключения ${connectionAttempts.current}/${maxRetries.current}...`)
					setTimeout(() => {
						wsClient.connect()
					}, 3000)
				} else {
					dispatch(setConnectionError('Превышено максимальное число попыток подключения'))
				}
			})
			.on('error', (errorData: unknown) => {
				// Обрабатываем как старый, так и новый формат ошибок
				let errorMessage = 'Неизвестная ошибка WebSocket'

				if (typeof errorData === 'string') {
					errorMessage = errorData
				} else if (errorData && typeof errorData === 'object' && 'message' in errorData) {
					errorMessage = (errorData as any).message
					// Логируем дополнительные детали если доступны
					if ('details' in errorData) {
						console.error('Детали ошибки WebSocket:', (errorData as any).details)
					}
				} else {
					errorMessage = errorCatch(errorData)
				}

				console.error('Ошибка WebSocket:', errorMessage)
				dispatch(setConnectionError(errorMessage))
				handleConnectionChange(false)
			})

			// Сигналы волатильности по типам
			.on('signal:volatility', (data: VolatilitySignal) => {
				console.log('Получен signal:volatility:', data)
				// Маршрутизируем на основе типа сигнала или структуры
				if (data.signalType === 'volatilitySpike') {
					dispatch(addVolatilitySpikeSignal(data))
				} else if (data.signalType === 'volatilityRange') {
					dispatch(addVolatilityRangeSignal(data))
				} else if (data.range !== undefined && data.avgRange !== undefined) {
					// Похоже на сигнал диапазона
					dispatch(addVolatilityRangeSignal({
						...data,
						signalType: 'volatilityRange'
					}))
				} else {
					// По умолчанию считаем всплеском
					dispatch(addVolatilitySpikeSignal({
						...data,
						signalType: 'volatilitySpike'
					}))
				}
			})
			.on('volatilitySpike', (data: VolatilitySignal) => {
				console.log('Получен volatilitySpike:', data)
				dispatch(addVolatilitySpikeSignal({
					...data,
					signalType: 'volatilitySpike'
				}))
			})
			.on('volatilityRange', (data: VolatilitySignal) => {
				console.log('Получен volatilityRange:', data)
				dispatch(addVolatilityRangeSignal({
					...data,
					signalType: 'volatilityRange'
				}))
			})

			// Сигналы объема
			.on('volumeSpike', (data: VolumeSignal) => {
				console.log('Получен всплеск объема:', data)
				dispatch(addVolumeSignal(data))
			})

			// Сигналы изменения цены
			.on('priceChange', (data: PriceChangeSignal) => {
				console.log('Получено изменение цены:', data)
				dispatch(addPriceChangeSignal(data))
			})

			// Топ гейнеры/лузеры за 5 минут
			.on('top:gainers:5min', (data: TimeframeCoin) => {
				console.log('Получены топ гейнеры 5 мин:', data)
				dispatch(addTimeframeGainer({ timeframe: '5min', data }))
			})
			.on('top:losers:5min', (data: TimeframeCoin) => {
				console.log('Получены топ лузеры 5 мин:', data)
				dispatch(addTimeframeLoser({ timeframe: '5min', data }))
			})
			.on('top:volume:5min', (data: VolumeSignal) => {
				console.log('Получен топ объем 5 мин:', data)
				dispatch(addTimeframeVolume({ timeframe: '5min', data }))
			})
			.on('top:funding:5min', (data: FundingCoin) => {
				console.log('Получено топ финансирование 5 мин:', data)
				dispatch(addFundingData({ data }))
			})

			// Топ гейнеры/лузеры за 24 часа
			.on('top:gainers:24h', (data: TimeframeCoin) => {
				console.log('Получены топ гейнеры 24ч:', data)
				dispatch(addTimeframeGainer({ timeframe: '24h', data }))
			})
			.on('top:losers:24h', (data: TimeframeCoin) => {
				console.log('Получены топ лузеры 24ч:', data)
				dispatch(addTimeframeLoser({ timeframe: '24h', data }))
			})

			// Триггерные события (специальные события для обновления UI)
			.on('trigger:gainers-5min', (data: string[]) => {
				console.log('Получен триггер гейнеры 5 мин:', data)
				dispatch(
					addTriggerEvent({
						timeframe: '5min',
						type: 'gainers',
						data
					})
				)
			})
			.on('trigger:losers-5min', (data: string[]) => {
				console.log('Получен триггер лузеры 5 мин:', data)
				dispatch(
					addTriggerEvent({
						timeframe: '5min',
						type: 'losers',
						data
					})
				)
			})
			.on('trigger:volume-5min', (data: string[]) => {
				console.log('Получен триггер объем 5 мин:', data)
				dispatch(
					addTriggerEvent({
						timeframe: '5min',
						type: 'volume',
						data
					})
				)
			})
			.on('trigger:funding-5min', (data: string[]) => {
				console.log('Получен триггер финансирование 5 мин:', data)
				dispatch(
					addTriggerEvent({
						timeframe: '5min',
						type: 'funding',
						data
					})
				)
			})
			.on('trigger:gainers-24h', (data: string[]) => {
				console.log('Получен триггер гейнеры 24ч:', data)
				dispatch(
					addTriggerEvent({
						timeframe: '24h',
						type: 'gainers',
						data
					})
				)
			})
			.on('trigger:losers-24h', (data: string[]) => {
				console.log('Получен триггер лузеры 24ч:', data)
				dispatch(
					addTriggerEvent({
						timeframe: '24h',
						type: 'losers',
						data
					})
				)
			})

		// Подключаемся к серверу
		try {
			wsClient.connect()
		} catch (error: unknown) {
			const errorMessage = errorCatch(error)
			console.error('Не удалось инициализировать WebSocket соединение:', errorMessage)
			dispatch(setConnectionError(errorMessage))
		}

		// Отмечаем инициализацию как завершенную
		initialized.current = true

		return wsClient
	}, [dispatch, handleConnectionChange])

	// Инициализируем WebSocket соединение
	useEffect(() => {
		// Не инициализируем дважды
		if (initialized.current) return

		const wsClient = initializeSocketConnection()

		// Очистка при размонтировании
		return () => {
			console.log('Очистка WebSocket соединения')
			try {
				wsClient.disconnect()
			} catch (error: unknown) {
				console.error('Ошибка при отключении WebSocket:', errorCatch(error))
			}
		}
	}, [dispatch, handleConnectionChange, initializeSocketConnection])

	return null
} 