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
			const signal = action.payload

			console.log(`💾 Adding volume signal to store: ${signal.symbol}`)

			// Check if signal with same symbol and timestamp already exists
			const existingIndex = state.signals.findIndex(
				existingSignal =>
					existingSignal.symbol === signal.symbol &&
					existingSignal.timestamp === signal.timestamp
			)

			if (existingIndex !== -1) {
				// Update existing signal instead of adding new one
				console.log(`🔄 Updating existing volume signal at index ${existingIndex}`)
				state.signals[existingIndex] = {
					...signal,
					// Preserve the creation time from the original signal
					createdAt: state.signals[existingIndex].createdAt || Date.now()
				}
			} else {
				// Add new signal at the beginning of the array with creation timestamp
				console.log(`➕ Adding new volume signal, current count: ${state.signals.length}`)
				state.signals.unshift({
					...signal,
					createdAt: Date.now()
				})

				// Keep only the most recent signals to prevent state from growing too large
				if (state.signals.length > MAX_SIGNALS) {
					console.log(`✂️ Trimming volume signals array to ${MAX_SIGNALS} items`)
					state.signals.length = MAX_SIGNALS
				}
			}

			// Log current signals count
			console.log(`📊 Current volume signals count: ${state.signals.length}`)

			// Update the lastUpdated timestamp
			state.lastUpdated = Date.now()
		},
		clearVolumeSignals: (state) => {
			console.log(`🧹 Clearing all volume signals`)
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