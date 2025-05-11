/**
 * Volatility Spike Signals Slice
 * ------------------------------
 * Redux slice for volatility spike signals
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { VolatilitySignal } from '../signal.types'

interface VolatilitySpikeState {
	signals: VolatilitySignal[]
	lastUpdated: number
}

const initialState: VolatilitySpikeState = {
	signals: [],
	lastUpdated: 0
}

// Reduce the maximum number of signals to improve performance
const MAX_SIGNALS = 50

export const volatilitySpikeSlice = createSlice({
	name: 'volatilitySpike',
	initialState,
	reducers: {
		addVolatilitySpikeSignal: (state, action: PayloadAction<VolatilitySignal>) => {
			// Ensure the signal has the correct type
			const signal = {
				...action.payload,
				signalType: 'volatilitySpike' as const
			}

			console.log(`💾 Adding volatility spike signal to store: ${signal.symbol}`)

			// Check if signal with same symbol and timestamp already exists
			const existingIndex = state.signals.findIndex(
				existingSignal =>
					existingSignal.symbol === signal.symbol &&
					existingSignal.timestamp === signal.timestamp
			)

			if (existingIndex !== -1) {
				// Update existing signal instead of adding new one
				console.log(`🔄 Updating existing volatility spike signal at index ${existingIndex}`)
				state.signals[existingIndex] = {
					...signal,
					// Preserve the creation time from the original signal
					createdAt: state.signals[existingIndex].createdAt || Date.now()
				}
			} else {
				// Add new signal at the beginning of the array with creation timestamp
				console.log(`➕ Adding new volatility spike signal, current count: ${state.signals.length}`)
				state.signals.unshift({
					...signal,
					createdAt: Date.now()
				})

				// Keep only the most recent signals to prevent state from growing too large
				if (state.signals.length > MAX_SIGNALS) {
					console.log(`✂️ Trimming volatility spike signals array to ${MAX_SIGNALS} items`)
					state.signals.length = MAX_SIGNALS
				}
			}

			// Log current signals count
			console.log(`📊 Current volatility spike signals count: ${state.signals.length}`)

			// Update the lastUpdated timestamp
			state.lastUpdated = Date.now()
		},
		clearVolatilitySpikeSignals: (state) => {
			console.log(`🧹 Clearing all volatility spike signals`)
			state.signals = []
			state.lastUpdated = Date.now()
		}
	}
})

export const {
	addVolatilitySpikeSignal,
	clearVolatilitySpikeSignals
} = volatilitySpikeSlice.actions

export default volatilitySpikeSlice.reducer 