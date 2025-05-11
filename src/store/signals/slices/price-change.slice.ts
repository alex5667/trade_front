/**
 * Price Change Signals Slice
 * ------------------------------
 * Redux slice for price change signals
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PriceChangeSignal } from '../signal.types'

interface PriceChangeState {
	signals: PriceChangeSignal[]
	lastUpdated: number
}

const initialState: PriceChangeState = {
	signals: [],
	lastUpdated: 0
}

// Reduce the maximum number of signals to improve performance
const MAX_SIGNALS = 50

export const priceChangeSlice = createSlice({
	name: 'priceChange',
	initialState,
	reducers: {
		addPriceChangeSignal: (state, action: PayloadAction<PriceChangeSignal>) => {
			const signal = action.payload

			console.log(`💾 Adding price change signal to store: ${signal.symbol}, direction: ${signal.direction}`)

			// Check if signal with same symbol and timestamp already exists
			const existingIndex = state.signals.findIndex(
				existingSignal =>
					existingSignal.symbol === signal.symbol &&
					existingSignal.timestamp === signal.timestamp
			)

			if (existingIndex !== -1) {
				// Update existing signal instead of adding new one
				console.log(`🔄 Updating existing price change signal at index ${existingIndex}`)
				state.signals[existingIndex] = {
					...signal,
					// Preserve the creation time from the original signal
					createdAt: state.signals[existingIndex].createdAt || Date.now()
				}
			} else {
				// Add new signal at the beginning of the array with creation timestamp
				console.log(`➕ Adding new price change signal, current count: ${state.signals.length}`)
				state.signals.unshift({
					...signal,
					createdAt: Date.now()
				})

				// Keep only the most recent signals to prevent state from growing too large
				if (state.signals.length > MAX_SIGNALS) {
					console.log(`✂️ Trimming price change signals array to ${MAX_SIGNALS} items`)
					state.signals.length = MAX_SIGNALS
				}
			}

			// Log current signals count
			console.log(`📊 Current price change signals count: ${state.signals.length}`)

			// Update the lastUpdated timestamp
			state.lastUpdated = Date.now()
		},
		clearPriceChangeSignals: (state) => {
			console.log(`🧹 Clearing all price change signals`)
			state.signals = []
			state.lastUpdated = Date.now()
		}
	}
})

export const {
	addPriceChangeSignal,
	clearPriceChangeSignals
} = priceChangeSlice.actions

export default priceChangeSlice.reducer 