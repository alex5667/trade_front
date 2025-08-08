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

			// Вычисляем range если он отсутствует
			if (signal.range === undefined && signal.high !== undefined && signal.low !== undefined) {
				signal.range = signal.high - signal.low
				console.log(`🔧 Calculated range for ${signal.symbol}: ${signal.range.toFixed(6)}`)
			}

			// Если range все еще undefined, используем 0
			if (signal.range === undefined) {
				signal.range = 0
			}

			// Обрабатываем avgRange
			if (signal.avgRange === undefined) {
				// Если avgRange не задан, но есть range, используем простую эвристику
				signal.avgRange = signal.range > 0 ? signal.range * 0.5 : 0
				console.log(`🔧 Set default avgRange for ${signal.symbol}: ${signal.avgRange.toFixed(6)}`)
			}

			// Вычисляем rangeRatio
			if (signal.rangeRatio === undefined) {
				if (signal.avgRange > 0) {
					signal.rangeRatio = signal.range / signal.avgRange
				} else {
					signal.rangeRatio = signal.range > 0 ? 2.0 : 1.0 // Если среднее = 0, но есть текущий range
				}
				console.log(`🔧 Calculated rangeRatio for ${signal.symbol}: ${signal.rangeRatio.toFixed(2)}`)
			}

			// Убеждаемся, что volatilityChange присутствует
			if (signal.volatilityChange === undefined) {
				// Если volatilityChange не задан, вычисляем его на основе range и avgRange
				if (signal.avgRange > 0) {
					// Стандартная формула: ((current - average) / average) * 100
					signal.volatilityChange = ((signal.range - signal.avgRange) / signal.avgRange) * 100
					console.log(`🔧 Calculated volatilityChange from range/avgRange for ${signal.symbol}: ${signal.volatilityChange.toFixed(2)}%`)
				} else {
					// Если avgRange = 0, то нет базы для сравнения, поэтому 0%
					signal.volatilityChange = 0
					console.log(`🔧 Set volatilityChange=0% for ${signal.symbol} (avgRange=0, no base for comparison)`)
				}
			}

			// Убеждаемся, что volatility присутствует
			if (signal.volatility === undefined) {
				// Вычисляем volatility на основе range и open price
				if (signal.open && signal.open > 0) {
					signal.volatility = (signal.range / signal.open) * 100
					console.log(`🔧 Calculated volatility for ${signal.symbol}: ${signal.volatility.toFixed(2)}%`)
				} else {
					signal.volatility = 0
					console.log(`🔧 Set volatility=0% for ${signal.symbol} (no open price)`)
				}
			}

			console.log(`💾 Adding volatility range signal to store: ${signal.symbol} (range: ${signal.range.toFixed(4)}, avgRange: ${signal.avgRange.toFixed(4)}, volatility: ${signal.volatility.toFixed(2)}%, change: ${signal.volatilityChange.toFixed(2)}%)`)

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