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
			// Check if signal with same symbol and timestamp already exists
			const existingIndex = state.signals.findIndex(
				signal =>
					signal.symbol === action.payload.symbol &&
					signal.timestamp === action.payload.timestamp
			)

			if (existingIndex !== -1) {
				// Update existing signal instead of adding new one
				state.signals[existingIndex] = action.payload
			} else {
				// Add new signal at the beginning of the array
				state.signals.unshift(action.payload)

				// Keep only the most recent signals to prevent state from growing too large
				if (state.signals.length > MAX_SIGNALS) {
					state.signals.length = MAX_SIGNALS
				}
			}

			// Update the lastUpdated timestamp
			state.lastUpdated = Date.now()
		},
		clearPriceChangeSignals: (state) => {
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