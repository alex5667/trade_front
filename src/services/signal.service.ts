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
	PriceChangeSignal,
	VolatilitySignal
} from '@/store/signals/signal.types'
import {
	connected,
	connecting,
	disconnected,
	setConnectionError
} from '@/store/signals/slices/connection.slice'
import { addPriceChangeSignal } from '@/store/signals/slices/price-change.slice'
import { addVolatilityRangeSignal } from '@/store/signals/slices/volatility-range.slice'
import { addVolatilitySpikeSignal } from '@/store/signals/slices/volatility-spike.slice'
import { addVolatilitySignal } from '@/store/signals/slices/volatility.slice'
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
		return
	}

	// Добавляем ID в множество обработанных сигналов
	processedSignals.add(signalId)

	// Отправляем в соответствующий slice в зависимости от типа сигнала
	switch (normalizedSignal.signalType) {
		case 'volatilitySpike':
			dispatch(addVolatilitySpikeSignal(normalizedSignal))
			break
		case 'volatilityRange':
			dispatch(addVolatilityRangeSignal(normalizedSignal))
			break
		default:
			// Для общих сигналов волатильности отправляем в основной slice
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
		dispatch(connected())
		// Очищаем множество обработанных сигналов при переподключении
		processedSignals.clear()
	})

	client.on('disconnect', () => {
		dispatch(disconnected())
	})

	client.on('error', (errorData: any) => {
		// Обрабатываем как старый, так и новый формат ошибок
		let errorMessage = 'Неизвестная ошибка Socket.IO'

		if (typeof errorData === 'string') {
			errorMessage = errorData
		} else if (errorData?.message) {
			errorMessage = errorData.message
		} else if (errorData instanceof Error) {
			errorMessage = errorData.message
		}

		dispatch(setConnectionError(errorMessage))
	})

	// Обработчики сигналов волатильности
	client.on('signal:volatility', (signal) => {
		handleVolatilitySignal(dispatch)(signal)
	})

	client.on('volatilitySpike', (signal) => {
		handleVolatilitySignal(dispatch)(signal)
	})

	client.on('volatility', (signal) => {
		handleVolatilitySignal(dispatch)(signal)
	})

	client.on('signal:volatilityRange', (signal) => {
		handleVolatilitySignal(dispatch)(signal)
	})

	client.on('volatilityRange', (signal) => {
		handleVolatilitySignal(dispatch)(signal)
	})

	// ВАЖНО: не подписываемся на объём и топы через WebSocket - только REST
	// Удалено: volumeSpike, top:gainers, top:losers и их response:*

	// Обработчики сигналов изменения цены остаются (если нужны)
	client.on('priceChange', (signal: PriceChangeSignal) => {
		dispatch(addPriceChangeSignal(signal))
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