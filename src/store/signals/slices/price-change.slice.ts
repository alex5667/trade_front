/**
 * Price Change Signals Slice
 * ------------------------------
 * Redux slice for price change signals
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PriceChangeSignal } from '../signal.types'

interface PriceChangeState {
	signals: PriceChangeSignal[]
}

const initialState: PriceChangeState = {
	signals: []
}

const MAX_SIGNALS = 100

export const priceChangeSlice = createSlice({
	name: 'priceChange',
	initialState,
	reducers: {
		addPriceChangeSignal: (state, action: PayloadAction<PriceChangeSignal>) => {
			state.signals = [action.payload, ...state.signals.slice(0, MAX_SIGNALS - 1)]
		},
		clearPriceChangeSignals: (state) => {
			state.signals = []
		}
	}
})

export const {
	addPriceChangeSignal,
	clearPriceChangeSignals
} = priceChangeSlice.actions

export default priceChangeSlice.reducer 