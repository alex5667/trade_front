/**
 * Volatility Range Signals Slice
 * ------------------------------
 * Redux slice for volatility range signals
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { VolatilitySignal } from '../signal.types'

interface VolatilityRangeState {
	signals: VolatilitySignal[]
	lastUpdated: number
}

const initialState: VolatilityRangeState = {
	signals: [],
	lastUpdated: 0
}

// Reduce the maximum number of signals to improve performance
const MAX_SIGNALS = 50

export const volatilityRangeSlice = createSlice({
	name: 'volatilityRange',
	initialState,
	reducers: {
		addVolatilityRangeSignal: (state, action: PayloadAction<VolatilitySignal>) => {
			// Ensure the signal has the correct type
			const signal = {
				...action.payload,
				signalType: 'volatilityRange' as const
			}

			// Проверяем наличие всех необходимых полей и выводим детальный лог
			console.log(`📊 Signal data check for ${signal.symbol}:
				- range: ${signal.range !== undefined ? signal.range : 'missing'}
				- avgRange: ${signal.avgRange !== undefined ? signal.avgRange : 'missing'} 
				- rangeRatio: ${signal.rangeRatio !== undefined ? signal.rangeRatio : 'missing'}
				- volatility: ${signal.volatility !== undefined ? signal.volatility : 'missing'}
				- volatilityChange: ${signal.volatilityChange !== undefined ? signal.volatilityChange : 'missing'}
			`)

			// Добавляем вычисление недостающих полей для сигналов volatilityRange
			if (signal.range === undefined && signal.high !== undefined && signal.low !== undefined) {
				// Вычисляем диапазон как разницу между максимумом и минимумом
				signal.range = signal.high - signal.low
				console.log(`🔧 Calculated range for ${signal.symbol}: ${signal.range.toFixed(6)}`)
			}

			if (signal.avgRange === undefined && signal.range !== undefined) {
				// Если нет средних значений, используем некоторые значения по умолчанию или расчетные
				signal.avgRange = signal.range * 0.8 // Просто для примера, обычно должно приходить с сервера
				console.log(`🔧 Added default avgRange for ${signal.symbol}: ${signal.avgRange.toFixed(6)}`)
			}

			if (signal.rangeRatio === undefined && signal.range !== undefined && signal.avgRange !== undefined) {
				signal.rangeRatio = signal.range / signal.avgRange
				console.log(`🔧 Calculated rangeRatio for ${signal.symbol}: ${signal.rangeRatio.toFixed(2)}`)
			}

			// Добавляем volatilityChange если он отсутствует
			if (signal.volatilityChange === undefined) {
				if (signal.rangeRatio !== undefined) {
					// Используем rangeRatio для вычисления volatilityChange (процентное отклонение от среднего)
					signal.volatilityChange = (signal.rangeRatio - 1) * 100
					console.log(`🔧 Calculated volatilityChange from rangeRatio for ${signal.symbol}: ${signal.volatilityChange.toFixed(2)}%`)
				} else if (signal.range !== undefined && signal.avgRange !== undefined) {
					// Вычисляем через range и avgRange
					signal.volatilityChange = ((signal.range / signal.avgRange) - 1) * 100
					console.log(`🔧 Calculated volatilityChange from range/avgRange for ${signal.symbol}: ${signal.volatilityChange.toFixed(2)}%`)
				} else {
					// Значение по умолчанию
					signal.volatilityChange = 0
					console.log(`⚠️ Using default volatilityChange=0 for ${signal.symbol}`)
				}
			}

			// Теперь проверяем, есть ли поля и если нет - добавляем значения по умолчанию
			const hasMissingFields =
				signal.range === undefined ||
				signal.avgRange === undefined ||
				signal.rangeRatio === undefined ||
				signal.volatilityChange === undefined

			if (hasMissingFields) {
				// Установим значения по умолчанию для отсутствующих полей
				signal.range = signal.range ?? (signal.volatility ? signal.volatility / 100 : 0)
				signal.avgRange = signal.avgRange ?? (signal.range * 0.8)
				signal.rangeRatio = signal.rangeRatio ?? 1.0
				signal.volatilityChange = signal.volatilityChange ?? 0

				console.log(`🔄 Set default values for missing fields on ${signal.symbol}:
					- range: ${signal.range.toFixed(6)}
					- avgRange: ${signal.avgRange.toFixed(6)}
					- rangeRatio: ${signal.rangeRatio.toFixed(2)}
					- volatilityChange: ${signal.volatilityChange.toFixed(2)}%
				`)
			}

			console.log(`💾 Adding volatility range signal to store: ${signal.symbol}`)

			// Check if signal with same symbol and timestamp already exists
			const existingIndex = state.signals.findIndex(
				existingSignal =>
					existingSignal.symbol === signal.symbol &&
					existingSignal.timestamp === signal.timestamp
			)

			if (existingIndex !== -1) {
				// Update existing signal instead of adding new one
				console.log(`🔄 Updating existing volatility range signal at index ${existingIndex}`)
				state.signals[existingIndex] = {
					...signal,
					// Preserve the creation time from the original signal
					createdAt: state.signals[existingIndex].createdAt || Date.now()
				}
			} else {
				// Add new signal at the beginning of the array with creation timestamp
				console.log(`➕ Adding new volatility range signal, current count: ${state.signals.length}`)
				state.signals.unshift({
					...signal,
					createdAt: Date.now()
				})

				// Keep only the most recent signals to prevent state from growing too large
				if (state.signals.length > MAX_SIGNALS) {
					console.log(`✂️ Trimming volatility range signals array to ${MAX_SIGNALS} items`)
					state.signals.length = MAX_SIGNALS
				}
			}

			// Log current signals count
			console.log(`📊 Current volatility range signals count: ${state.signals.length}`)

			// Update the lastUpdated timestamp
			state.lastUpdated = Date.now()
		},
		clearVolatilityRangeSignals: (state) => {
			console.log(`🧹 Clearing all volatility range signals`)
			state.signals = []
			state.lastUpdated = Date.now()
		}
	}
})

export const {
	addVolatilityRangeSignal,
	clearVolatilityRangeSignals
} = volatilityRangeSlice.actions

export default volatilityRangeSlice.reducer 