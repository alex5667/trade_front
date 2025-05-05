/**
 * Volume Signals Slice
 * ------------------------------
 * Redux slice for volume spike signals
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { VolumeSignal } from '../signal.types'

interface VolumeState {
	signals: VolumeSignal[]
}

const initialState: VolumeState = {
	signals: []
}

const MAX_SIGNALS = 100

export const volumeSlice = createSlice({
	name: 'volume',
	initialState,
	reducers: {
		addVolumeSignal: (state, action: PayloadAction<VolumeSignal>) => {
			state.signals = [action.payload, ...state.signals.slice(0, MAX_SIGNALS - 1)]
		},
		clearVolumeSignals: (state) => {
			state.signals = []
		}
	}
})

export const {
	addVolumeSignal,
	clearVolumeSignals
} = volumeSlice.actions

export default volumeSlice.reducer 