/**
 * Volatility Signals Slice
 * ------------------------------
 * Redux slice for volatility signals
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { VolatilitySignal } from '../signal.types'

interface VolatilityState {
	signals: VolatilitySignal[]
}

const initialState: VolatilityState = {
	signals: []
}

const MAX_SIGNALS = 100

export const volatilitySlice = createSlice({
	name: 'volatility',
	initialState,
	reducers: {
		addVolatilitySignal: (state, action: PayloadAction<VolatilitySignal>) => {
			state.signals = [action.payload, ...state.signals.slice(0, MAX_SIGNALS - 1)]
		},
		clearVolatilitySignals: (state) => {
			state.signals = []
		}
	}
})

export const {
	addVolatilitySignal,
	clearVolatilitySignals
} = volatilitySlice.actions

export default volatilitySlice.reducer 