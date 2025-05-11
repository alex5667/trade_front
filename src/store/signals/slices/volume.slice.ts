/**
 * Volume Signals Slice
 * ------------------------------
 * Redux slice for volume signals
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { VolumeSignal } from '../signal.types'

interface VolumeState {
	signals: VolumeSignal[]
	lastUpdated: number
}

const initialState: VolumeState = {
	signals: [],
	lastUpdated: 0
}

// Reduce the maximum number of signals to improve performance
const MAX_SIGNALS = 50

export const volumeSlice = createSlice({
	name: 'volume',
	initialState,
	reducers: {
		addVolumeSignal: (state, action: PayloadAction<VolumeSignal>) => {
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
		clearVolumeSignals: (state) => {
			state.signals = []
			state.lastUpdated = Date.now()
		}
	}
})

export const {
	addVolumeSignal,
	clearVolumeSignals
} = volumeSlice.actions

export default volumeSlice.reducer 