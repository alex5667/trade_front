/**
 * Signals Redux Slice
 * ------------------------------
 * Слайс Redux для управления всеми торговыми сигналами
 * и состоянием подключения WebSocket
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
	FundingCoin,
	PriceChangeSignal,
	SignalsState,
	TimeframeCoin,
	TriggerEvent,
	VolatilitySignal,
	VolumeSignal
} from './signal.types'

// Начальное состояние слайса сигналов
const initialState: SignalsState = {
	connection: {
		isConnected: false,
		lastError: null
	},
	volatilitySignals: [],
	volumeSignals: [],
	priceChangeSignals: [],
	timeframe: {
		'5min': {
			gainers: [],
			losers: [],
			volume: []
		},
		'24h': {
			gainers: [],
			losers: []
		}
	},
	funding: [],
	triggers: {
		'5min': {
			gainers: [],
			losers: [],
			volume: [],
			funding: []
		},
		'24h': {
			gainers: [],
			losers: []
		}
	}
}

// Функция для логирования действий Redux
const logAction = (actionType: string, payload: any) => {
	// console.log(`🔄 [Redux] ${actionType}:`, payload)
}

/**
 * Слайс сигналов - основной слайс для управления торговыми сигналами
 */
export const signalsSlice = createSlice({
	name: 'signals',
	initialState,
	reducers: {
		// Обновление статуса соединения
		setConnectionStatus: (state, action: PayloadAction<boolean>) => {
			logAction('setConnectionStatus', action.payload)
			state.connection.isConnected = action.payload
		},

		// Установка ошибки соединения
		setConnectionError: (state, action: PayloadAction<string | null>) => {
			logAction('setConnectionError', action.payload)
			state.connection.lastError = action.payload
		},

		// Добавление сигнала волатильности
		addVolatilitySignal: (state, action: PayloadAction<VolatilitySignal>) => {
			// Используем только поля, которые точно есть в типе VolatilitySignal
			logAction('addVolatilitySignal', {
				symbol: action.payload.symbol,
				timestamp: action.payload.timestamp
			})

			// Проверяем, существует ли уже сигнал с таким же символом и временем
			const existingIndex = state.volatilitySignals.findIndex(
				(s) =>
					s.symbol === action.payload.symbol &&
					s.timestamp === action.payload.timestamp
			)

			if (existingIndex >= 0) {
				// Обновляем существующий сигнал
				state.volatilitySignals[existingIndex] = action.payload
			} else {
				// Добавляем новый сигнал в начало массива
				state.volatilitySignals.unshift(action.payload)
			}

			// Ограничиваем количество хранимых сигналов (не более 100)
			if (state.volatilitySignals.length > 100) {
				state.volatilitySignals = state.volatilitySignals.slice(0, 100)
			}

		},

		// Добавление сигнала объема
		addVolumeSignal: (state, action: PayloadAction<VolumeSignal>) => {
			logAction('addVolumeSignal', {
				symbol: action.payload.symbol,
				volumeChange: action.payload.volumeChange,
				timestamp: action.payload.timestamp
			})

			// Проверяем, существует ли уже сигнал с таким же символом и временем
			const existingIndex = state.volumeSignals.findIndex(
				(s) =>
					s.symbol === action.payload.symbol &&
					s.timestamp === action.payload.timestamp
			)

			if (existingIndex >= 0) {
				// Обновляем существующий сигнал
				state.volumeSignals[existingIndex] = action.payload
			} else {
				// Добавляем новый сигнал в начало массива
				state.volumeSignals.unshift(action.payload)
			}

			// Ограничиваем количество хранимых сигналов (не более 100)
			if (state.volumeSignals.length > 100) {
				state.volumeSignals = state.volumeSignals.slice(0, 100)
			}
		},

		// Добавление сигнала изменения цены
		addPriceChangeSignal: (state, action: PayloadAction<PriceChangeSignal>) => {
			logAction('addPriceChangeSignal', {
				symbol: action.payload.symbol,
				priceChange: action.payload.priceChange,
				timestamp: action.payload.timestamp
			})

			// Проверяем, существует ли уже сигнал с таким же символом и временем
			const existingIndex = state.priceChangeSignals.findIndex(
				(s) =>
					s.symbol === action.payload.symbol &&
					s.timestamp === action.payload.timestamp
			)

			if (existingIndex >= 0) {
				// Обновляем существующий сигнал
				state.priceChangeSignals[existingIndex] = action.payload
			} else {
				// Добавляем новый сигнал в начало массива
				state.priceChangeSignals.unshift(action.payload)
			}

			// Ограничиваем количество хранимых сигналов (не более 100)
			if (state.priceChangeSignals.length > 100) {
				state.priceChangeSignals = state.priceChangeSignals.slice(0, 100)
			}
		},

		// Добавление роста монеты в указанном таймфрейме
		addTimeframeGainer: (
			state,
			action: PayloadAction<{
				timeframe: '5min' | '24h'
				data: TimeframeCoin
			}>
		) => {
			const { timeframe, data } = action.payload
			logAction('addTimeframeGainer', {
				timeframe,
				symbol: data.symbol,
				percentChange: data.percentChange
			})

			// Проверяем, существует ли уже монета с таким символом
			const existingIndex = state.timeframe[timeframe].gainers.findIndex(
				(coin) => coin.symbol === data.symbol
			)

			if (existingIndex >= 0) {
				// Обновляем существующую монету
				state.timeframe[timeframe].gainers[existingIndex] = data
			} else {
				// Добавляем новую монету и сортируем по изменению цены
				state.timeframe[timeframe].gainers.push(data)
			}

			// Сортируем по убыванию процента изменения
			state.timeframe[timeframe].gainers.sort(
				(a, b) => b.percentChange - a.percentChange
			)

			// Ограничиваем количество монет в топе (не более 20)
			if (state.timeframe[timeframe].gainers.length > 20) {
				state.timeframe[timeframe].gainers = state.timeframe[
					timeframe
				].gainers.slice(0, 20)
			}
		},

		// Добавление падения монеты в указанном таймфрейме
		addTimeframeLoser: (
			state,
			action: PayloadAction<{
				timeframe: '5min' | '24h'
				data: TimeframeCoin
			}>
		) => {
			const { timeframe, data } = action.payload
			logAction('addTimeframeLoser', {
				timeframe,
				symbol: data.symbol,
				percentChange: data.percentChange
			})

			// Проверяем, существует ли уже монета с таким символом
			const existingIndex = state.timeframe[timeframe].losers.findIndex(
				(coin) => coin.symbol === data.symbol
			)

			if (existingIndex >= 0) {
				// Обновляем существующую монету
				state.timeframe[timeframe].losers[existingIndex] = data
			} else {
				// Добавляем новую монету
				state.timeframe[timeframe].losers.push(data)
			}

			// Сортируем по возрастанию процента изменения (самые большие падения вверху)
			state.timeframe[timeframe].losers.sort(
				(a, b) => a.percentChange - b.percentChange
			)

			// Ограничиваем количество монет в топе (не более 20)
			if (state.timeframe[timeframe].losers.length > 20) {
				state.timeframe[timeframe].losers = state.timeframe[
					timeframe
				].losers.slice(0, 20)
			}
		},

		// Добавление монеты с большим объемом в указанном таймфрейме
		addTimeframeVolume: (
			state,
			action: PayloadAction<{
				timeframe: '5min'
				data: VolumeSignal
			}>
		) => {
			const { data } = action.payload
			logAction('addTimeframeVolume', {
				timeframe: '5min',
				symbol: data.symbol,
				volumeChange: data.volumeChange
			})

			// Проверяем, существует ли уже монета с таким символом
			const existingIndex = state.timeframe['5min'].volume.findIndex(
				(coin) => coin.symbol === data.symbol
			)

			if (existingIndex >= 0) {
				// Обновляем существующую монету
				state.timeframe['5min'].volume[existingIndex] = data
			} else {
				// Добавляем новую монету
				state.timeframe['5min'].volume.push(data)
			}

			// Сортируем по убыванию процента изменения объема
			state.timeframe['5min'].volume.sort(
				(a, b) => b.volumeChange - a.volumeChange
			)

			// Ограничиваем количество монет в топе (не более 20)
			if (state.timeframe['5min'].volume.length > 20) {
				state.timeframe['5min'].volume = state.timeframe['5min'].volume.slice(
					0,
					20
				)
			}
		},

		// Добавление данных о фондировании
		addFundingData: (state, action: PayloadAction<{ data: FundingCoin }>) => {
			const { data } = action.payload
			logAction('addFundingData', {
				symbol: data.symbol,
				rate: data.rate
			})

			// Проверяем, существует ли уже монета с таким символом
			const existingIndex = state.funding.findIndex(
				(coin) => coin.symbol === data.symbol
			)

			if (existingIndex >= 0) {
				// Обновляем существующую монету
				state.funding[existingIndex] = data
			} else {
				// Добавляем новую монету
				state.funding.push(data)
			}

			// Сортируем по убыванию ставки фондирования
			state.funding.sort((a, b) => Math.abs(b.rate) - Math.abs(a.rate))

			// Ограничиваем количество монет в списке (не более 20)
			if (state.funding.length > 20) {
				state.funding = state.funding.slice(0, 20)
			}
		},

		// Добавление триггер-события для обновления UI
		addTriggerEvent: (
			state,
			action: PayloadAction<TriggerEvent>
		) => {
			const { timeframe, type, data } = action.payload
			logAction('addTriggerEvent', {
				timeframe,
				type,
				dataLength: Array.isArray(data) ? data.length : 1
			})

			// Проверка на валидность типа триггера для заданного таймфрейма
			if (
				timeframe === '5min' ||
				(timeframe === '24h' && (type === 'gainers' || type === 'losers'))
			) {
				// Добавляем триггер и ограничиваем 10 элементами
				if (Array.isArray(data)) {
					// Если data - массив, заменяем текущие триггеры
					// @ts-ignore - Игнорируем ошибку доступа к индексу, так как мы проверяем валидность выше
					state.triggers[timeframe][type] = data.slice(0, 10)
				} else if (typeof data === 'string') {
					// Если data - строка, добавляем её только если её нет в массиве
					// @ts-ignore - Игнорируем ошибку доступа к индексу, так как мы проверяем валидность выше
					if (!state.triggers[timeframe][type].includes(data)) {
						// @ts-ignore - Игнорируем ошибку доступа к индексу, так как мы проверяем валидность выше
						state.triggers[timeframe][type].unshift(data)
						// Ограничиваем 10 элементами
						// @ts-ignore - Игнорируем ошибку доступа к индексу, так как мы проверяем валидность выше
						if (state.triggers[timeframe][type].length > 10) {
							// @ts-ignore - Игнорируем ошибку доступа к индексу, так как мы проверяем валидность выше
							state.triggers[timeframe][type].pop()
						}
					}
				}
			}
		},

		// Очистка всех сигналов
		clearSignals: (state) => {
			logAction('clearSignals', {})
			state.volatilitySignals = []
			state.volumeSignals = []
			state.priceChangeSignals = []
			state.timeframe = initialState.timeframe
			state.funding = []
			state.triggers = initialState.triggers
		}
	}
})

// Экспорт действий
export const {
	setConnectionStatus,
	setConnectionError,
	addVolatilitySignal,
	addVolumeSignal,
	addPriceChangeSignal,
	addTimeframeGainer,
	addTimeframeLoser,
	addTimeframeVolume,
	addFundingData,
	addTriggerEvent,
	clearSignals
} = signalsSlice.actions

// Экспорт редьюсера
export default signalsSlice.reducer 