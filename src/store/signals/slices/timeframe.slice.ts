/**
 * Слайс таймфреймов
 * ------------------------------
 * Redux слайс для данных по 24-часовому временному интервалу
 * Управляет топами растущих/падающих активов
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TimeframeCoin, TimeframeData } from '../signal.types'

const initialState: TimeframeData = {
	gainers: [],
	losers: []
}

const MAX_ITEMS = 20

export const timeframeSlice = createSlice({
	name: 'timeframe',
	initialState,
	reducers: {
		replaceTimeframeGainers: (state, action: PayloadAction<{ data: TimeframeCoin[] }>) => {
			state.gainers = (action.payload.data || [])
				.slice()
				.sort((a, b) => b.percentChange - a.percentChange)
				.slice(0, MAX_ITEMS)
		},
		replaceTimeframeLosers: (state, action: PayloadAction<{ data: TimeframeCoin[] }>) => {
			state.losers = (action.payload.data || [])
				.slice()
				.sort((a, b) => a.percentChange - b.percentChange)
				.slice(0, MAX_ITEMS)
		},
		clearTimeframeData: () => initialState
	}
})

export const { replaceTimeframeGainers, replaceTimeframeLosers, clearTimeframeData } = timeframeSlice.actions

export default timeframeSlice.reducer 