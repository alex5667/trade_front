/**
 * Volatility Signals Slice
 * ------------------------------
 * Redux slice for volatility signals
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { VolatilitySignal } from '../signal.types'

interface VolatilityState {
	signals: VolatilitySignal[]
	lastUpdated: number
}

const initialState: VolatilityState = {
	signals: [],
	lastUpdated: 0
}

// Reduce the maximum number of signals to improve performance
const MAX_SIGNALS = 50

export const volatilitySlice = createSlice({
	name: 'volatility',
	initialState,
	reducers: {
		addVolatilitySignal: (state, action: PayloadAction<VolatilitySignal>) => {
			console.log(`💾 Adding volatility signal to store: ${action.payload.symbol}, type: ${action.payload.signalType || 'volatility'}`)

			// Check if signal with same symbol and timestamp already exists
			const existingIndex = state.signals.findIndex(
				signal =>
					signal.symbol === action.payload.symbol &&
					signal.timestamp === action.payload.timestamp &&
					signal.signalType === action.payload.signalType
			)

			if (existingIndex !== -1) {
				// Update existing signal instead of adding new one
				console.log(`🔄 Updating existing signal at index ${existingIndex}`)
				state.signals[existingIndex] = {
					...action.payload,
					// Preserve the creation time from the original signal
					createdAt: state.signals[existingIndex].createdAt || Date.now()
				}
			} else {
				// Add new signal at the beginning of the array with creation timestamp
				console.log(`➕ Adding new signal, current count: ${state.signals.length}`)
				state.signals.unshift({
					...action.payload,
					createdAt: Date.now()
				})

				// Keep only the most recent signals to prevent state from growing too large
				if (state.signals.length > MAX_SIGNALS) {
					console.log(`✂️ Trimming signals array to ${MAX_SIGNALS} items`)
					state.signals.length = MAX_SIGNALS
				}
			}

			// Log current signals count
			console.log(`📊 Current volatility signals count: ${state.signals.length}`)

			// Update the lastUpdated timestamp
			state.lastUpdated = Date.now()
		},
		clearVolatilitySignals: (state) => {
			console.log(`🧹 Clearing all volatility signals`)
			state.signals = []
			state.lastUpdated = Date.now()
		}
	}
})

export const {
	addVolatilitySignal,
	clearVolatilitySignals
} = volatilitySlice.actions

export default volatilitySlice.reducer 