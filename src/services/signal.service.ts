/**
 * Сервис обработки сигналов
 * ------------------------------
 * Сервис, который управляет WebSocket соединением и отправляет
 * полученные сигналы в Redux хранилище
 * 
 * Основные функции:
 * - Инициализация WebSocket соединения
 * - Обработка различных типов торговых сигналов
 * - Нормализация данных перед отправкой в Redux
 * - Предотвращение дублирования сигналов
 * - Управление состоянием соединения
 */
'use client'

import {
	AnyObject,
	PriceChangeSignal,
	VolatilitySignal,
	VolumeSignal
} from '@/store/signals/signal.types'
import {
	connected,
	connecting,
	disconnected,
	setConnectionError
} from '@/store/signals/slices/connection.slice'
import { addPriceChangeSignal } from '@/store/signals/slices/price-change.slice'
import {
	addTimeframeGainer,
	addTimeframeLoser
} from '@/store/signals/slices/timeframe.slice'
import {
	addTriggerEvent
} from '@/store/signals/slices/trigger.slice'
import { addVolatilitySignal } from '@/store/signals/slices/volatility.slice'
import { addVolumeSignal } from '@/store/signals/slices/volume.slice'
import {
	parseSymbols,
	parseTimeframeCoins
} from '@/store/signals/utils/signal-parsers'
import { AppDispatch } from '@/store/store'
import { getWebSocketClient } from './websocket.service'

/**
 * Нормализация сигнала волатильности для обеспечения согласованной структуры
 * 
 * Приводит различные типы сигналов волатильности к единому формату
 * для корректного сохранения в Redux хранилище.
 * 
 * @param signal - Исходный сигнал для нормализации
 * @returns Нормализованный сигнал волатильности
 */
const normalizeVolatilitySignal = (signal: any): VolatilitySignal => {
	const normalizedSignal = { ...signal }

	// Устанавливаем тип 'volatility' для согласованности в хранилище
	if (signal.type === 'volatilitySpike' || signal.type === 'volatilityRange') {
		normalizedSignal.type = 'volatility'
		normalizedSignal.signalType = signal.type
	}

	// Обеспечиваем наличие обязательных полей
	if (!normalizedSignal.volatilityChange && normalizedSignal.volatility) {
		normalizedSignal.volatilityChange = 0
	}

	return normalizedSignal as VolatilitySignal
}

/** Множество для отслеживания обработанных сигналов и предотвращения дублирования */
const processedSignals = new Set<string>()

/**
 * Инициализация сервиса сигналов
 * 
 * Устанавливает WebSocket соединение и настраивает обработчики событий
 * для отправки действий в Redux хранилище. Обрабатывает все типы
 * торговых сигналов и управляет состоянием соединения.
 * 
 * @param dispatch - Функция dispatch из Redux для отправки действий
 * @returns Функция очистки для корректного закрытия соединения
 */
export const initializeSignalService = (dispatch: AppDispatch) => {
	const client = getWebSocketClient()

	// Отправляем действие о начале подключения
	dispatch(connecting())

	// Обработчики состояния соединения
	client.on('connect', () => {
		console.log('Сервис сигналов: WebSocket подключен, обновляем Redux хранилище')
		dispatch(connected())
		// Очищаем множество обработанных сигналов при переподключении
		processedSignals.clear()
	})

	client.on('disconnect', () => {
		console.log('Сервис сигналов: WebSocket отключен, обновляем Redux хранилище')
		dispatch(disconnected())
	})

	client.on('error', (errorData: any) => {
		// Обрабатываем как старый, так и новый формат ошибок
		let errorMessage = 'Неизвестная ошибка WebSocket'

		if (typeof errorData === 'string') {
			errorMessage = errorData
		} else if (errorData?.message) {
			errorMessage = errorData.message
			// Логируем дополнительные детали если доступны
			if (errorData.details) {
				console.error('Сервис сигналов: Детали ошибки WebSocket:', errorData.details)
			}
		} else if (errorData instanceof Error) {
			errorMessage = errorData.message
		}

		console.error('Сервис сигналов: Ошибка WebSocket -', errorMessage)
		dispatch(setConnectionError(errorMessage))
	})

	/**
	 * Универсальный обработчик для всех сигналов волатильности
	 * 
	 * Обрабатывает входящие сигналы волатильности, предотвращает
	 * дублирование и отправляет нормализованные данные в Redux.
	 * 
	 * @param signal - Сигнал волатильности для обработки
	 */
	const handleVolatilitySignal = (signal: any) => {
		// Создаем уникальный ключ для этого сигнала для обнаружения дубликатов
		const signalKey = `${signal.type}:${signal.symbol}:${signal.timestamp}`

		// Логируем входящий сигнал
		console.log(`📥 Получен сигнал: ${signalKey}`, signal)

		// Пропускаем если уже обработали этот сигнал
		if (processedSignals.has(signalKey)) {
			console.log(`🔄 Пропускаем дублирующий сигнал: ${signalKey}`)
			return
		}

		// Нормализуем и отправляем сигнал
		const normalizedSignal = normalizeVolatilitySignal(signal)
		console.log(`📦 Нормализованный сигнал для Redux:`, normalizedSignal)

		// Отправляем в Redux хранилище
		console.log(`📤 Отправляем в Redux хранилище: ${normalizedSignal.symbol}, тип: ${normalizedSignal.signalType || 'volatility'}`)
		dispatch(addVolatilitySignal(normalizedSignal))

		// Запоминаем что обработали этот сигнал
		processedSignals.add(signalKey)
		console.log(`✅ Добавлен ${signalKey} в множество обработанных сигналов (размер: ${processedSignals.size})`)

		// Ограничиваем размер множества обработанных сигналов
		if (processedSignals.size > 1000) {
			// Удаляем самые старые записи (первые 500)
			const toRemove = Array.from(processedSignals).slice(0, 500)
			toRemove.forEach(key => processedSignals.delete(key))
			console.log(`🧹 Очищено множество обработанных сигналов, удалено ${toRemove.length} элементов`)
		}
	}

	// Обработчики сигналов волатильности
	client.on('signal:volatility', handleVolatilitySignal)
	client.on('volatilitySpike', handleVolatilitySignal)
	client.on('volatility', handleVolatilitySignal)
	client.on('signal:volatilityRange', handleVolatilitySignal)
	client.on('volatilityRange', handleVolatilitySignal)

	// Обработчики сигналов объема
	client.on('volumeSpike', (signal: VolumeSignal) => {
		dispatch(addVolumeSignal(signal))
	})

	// Обработчики сигналов изменения цены
	client.on('priceChange', (signal: PriceChangeSignal) => {
		dispatch(addPriceChangeSignal(signal))
	})

	// Обработчики данных за 24 часа
	client.on('top:gainers:24h', (data: AnyObject) => {
		const coins = parseTimeframeCoins(data)
		coins.forEach(coin => {
			dispatch(addTimeframeGainer({ timeframe: '24h', data: coin }))
		})
	})

	client.on('top:losers:24h', (data: AnyObject) => {
		const coins = parseTimeframeCoins(data)
		coins.forEach(coin => {
			dispatch(addTimeframeLoser({ timeframe: '24h', data: coin }))
		})
	})

	// Обработчики триггерных событий
	client.on('trigger:gainers-24h', (data: AnyObject) => {
		const symbols = parseSymbols(data)
		dispatch(addTriggerEvent({
			timeframe: '24h',
			type: 'gainers',
			data: symbols
		}))
	})

	client.on('trigger:losers-24h', (data: AnyObject) => {
		const symbols = parseSymbols(data)
		dispatch(addTriggerEvent({
			timeframe: '24h',
			type: 'losers',
			data: symbols
		}))
	})

	// Подключаемся к WebSocket серверу
	client.connect()

	// Возвращаем функцию очистки
	return () => {
		client.disconnect()
	}
}

/**
 * Получить текущий статус WebSocket соединения
 * 
 * Проверяет активность WebSocket соединения и возвращает
 * строковое представление состояния.
 * 
 * @returns 'connected' если соединение активно, 'disconnected' в противном случае
 */
export const getConnectionStatus = () => {
	const client = getWebSocketClient()
	return client.isActive() ? 'connected' : 'disconnected'
} 