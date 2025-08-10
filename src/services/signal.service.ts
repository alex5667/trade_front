/**
 * Сервис обработки сигналов
 * ------------------------------
 * Сервис, который управляет Socket.IO соединением и отправляет
 * полученные сигналы в Redux хранилище
 * 
 * Основные функции:
 * - Инициализация Socket.IO соединения
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
	replaceTimeframeGainers,
	replaceTimeframeLosers
} from '@/store/signals/slices/timeframe.slice'
import { addVolatilityRangeSignal } from '@/store/signals/slices/volatility-range.slice'
import { addVolatilitySpikeSignal } from '@/store/signals/slices/volatility-spike.slice'
import { addVolatilitySignal } from '@/store/signals/slices/volatility.slice'
import { addVolumeSignal } from '@/store/signals/slices/volume.slice'
import {
	parseTimeframeCoins
} from '@/store/signals/utils/signal-parsers'
import { AppDispatch } from '@/store/store'
import { getSocketIOClient } from './socket-io.service'

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

/**
 * Вспомогательная функция для создания уникального ID сигнала
 * Используется для предотвращения дублирования одинаковых сигналов
 */
const createSignalId = (signal: VolatilitySignal): string => {
	if (!signal || !signal.symbol || !signal.timestamp) {
		return `${Date.now()}-${Math.random()}`
	}

	// Создаем ID на основе ключевых свойств сигнала
	return `${signal.type}-${signal.symbol}-${signal.interval}-${signal.timestamp}`
}

/**
 * Обработчик сигналов волатильности с предотвращением дублирования
 * Проверяет, был ли уже обработан сигнал с таким же ID и отправляет
 * в соответствующий slice в зависимости от типа сигнала
 */
const handleVolatilitySignal = (dispatch: AppDispatch) => (signal: any) => {
	if (!signal) return

	// Нормализуем сигнал перед обработкой
	const normalizedSignal = normalizeVolatilitySignal(signal)
	const signalId = createSignalId(normalizedSignal)

	// Проверяем, был ли уже обработан этот сигнал
	if (processedSignals.has(signalId)) {
		console.log(`Сигнал ${signalId} уже был обработан, пропускаем`)
		return
	}

	// Добавляем ID в множество обработанных сигналов
	processedSignals.add(signalId)

	console.log(`📊 Обрабатываем сигнал волатильности: ${normalizedSignal.symbol} (${normalizedSignal.signalType || normalizedSignal.type})`)

	// Отправляем в соответствующий slice в зависимости от типа сигнала
	switch (normalizedSignal.signalType) {
		case 'volatilitySpike':
			console.log(`🔥 Отправляем volatilitySpike сигнал для ${normalizedSignal.symbol}`)
			dispatch(addVolatilitySpikeSignal(normalizedSignal))
			break
		case 'volatilityRange':
			console.log(`📊 Отправляем volatilityRange сигнал для ${normalizedSignal.symbol}`)
			dispatch(addVolatilityRangeSignal(normalizedSignal))
			break
		default:
			// Для общих сигналов волатильности отправляем в основной slice
			console.log(`⚡ Отправляем общий volatility сигнал для ${normalizedSignal.symbol}`)
			dispatch(addVolatilitySignal(normalizedSignal))
			break
	}
}

/** Множество для отслеживания обработанных сигналов и предотвращения дублирования */
const processedSignals = new Set<string>()

/**
 * Инициализация сервиса сигналов
 * 
 * Устанавливает Socket.IO соединение и настраивает обработчики событий
 * для отправки действий в Redux хранилище. Обрабатывает все типы
 * торговых сигналов и управляет состоянием соединения.
 * 
 * @param dispatch - Функция dispatch из Redux для отправки действий
 * @returns Функция очистки для корректного закрытия соединения
 */
export const initializeSignalService = (dispatch: AppDispatch) => {
	const client = getSocketIOClient()

	// Отправляем действие о начале подключения
	dispatch(connecting())

	// Обработчики состояния соединения
	client.on('connect', () => {
		console.log('Сервис сигналов: Socket.IO подключен, обновляем Redux хранилище')
		dispatch(connected())
		// Очищаем множество обработанных сигналов при переподключении
		processedSignals.clear()
	})

	client.on('disconnect', () => {
		console.log('Сервис сигналов: Socket.IO отключен, обновляем Redux хранилище')
		dispatch(disconnected())
	})

	client.on('error', (errorData: any) => {
		// Обрабатываем как старый, так и новый формат ошибок
		let errorMessage = 'Неизвестная ошибка Socket.IO'

		if (typeof errorData === 'string') {
			errorMessage = errorData
		} else if (errorData?.message) {
			errorMessage = errorData.message
			// Логируем дополнительные детали если доступны
			if (errorData.details) {
				console.error('Сервис сигналов: Детали ошибки Socket.IO:', errorData.details)
			}
		} else if (errorData instanceof Error) {
			errorMessage = errorData.message
		}

		console.error('Сервис сигналов: Ошибка Socket.IO -', errorMessage)
		dispatch(setConnectionError(errorMessage))
	})

	// Обработчики сигналов волатильности
	client.on('signal:volatility', handleVolatilitySignal(dispatch))
	client.on('volatilitySpike', handleVolatilitySignal(dispatch))
	client.on('volatility', handleVolatilitySignal(dispatch))
	client.on('signal:volatilityRange', handleVolatilitySignal(dispatch))
	client.on('volatilityRange', handleVolatilitySignal(dispatch))

	// Обработчики сигналов объема
	client.on('volumeSpike', (signal: VolumeSignal) => {
		dispatch(addVolumeSignal(signal))
	})

	// Обработчики сигналов изменения цены
	client.on('priceChange', (signal: PriceChangeSignal) => {
		dispatch(addPriceChangeSignal(signal))
	})

	// Обработчики данных топов (без таймфрейма)
	client.on('top:gainers', (data: AnyObject) => {
		const coins = parseTimeframeCoins(data)
		dispatch(replaceTimeframeGainers({ data: coins }))
	})

	client.on('top:losers', (data: AnyObject) => {
		const coins = parseTimeframeCoins(data)
		dispatch(replaceTimeframeLosers({ data: coins }))
	})


	// Подключаемся к Socket.IO серверу
	client.connect()

	// Возвращаем функцию очистки
	return () => {
		client.disconnect()
	}
}

/**
 * Получить текущий статус Socket.IO соединения
 * 
 * Проверяет активность Socket.IO соединения и возвращает
 * строковое представление состояния.
 * 
 * @returns 'connected' если соединение активно, 'disconnected' в противном случае
 */
export const getConnectionStatus = () => {
	const client = getSocketIOClient()
	return client.isActive() ? 'connected' : 'disconnected'
} 