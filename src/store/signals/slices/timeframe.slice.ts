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
			// Deduplicate gainers by symbol before replacing
			const uniqueGainers = (action.payload.data || []).reduce((acc: TimeframeCoin[], coin) => {
				const existingIndex = acc.findIndex(c => c.symbol === coin.symbol)
				if (existingIndex === -1) {
					acc.push(coin)
				} else {
					// Update existing coin with newer data
					acc[existingIndex] = coin
				}
				return acc
			}, [])

			state.gainers = uniqueGainers
				.slice()
				.sort((a, b) => b.percentChange - a.percentChange)
				.slice(0, MAX_ITEMS)
		},
		replaceTimeframeLosers: (state, action: PayloadAction<{ data: TimeframeCoin[] }>) => {
			// Deduplicate losers by symbol before replacing
			const uniqueLosers = (action.payload.data || []).reduce((acc: TimeframeCoin[], coin) => {
				const existingIndex = acc.findIndex(c => c.symbol === coin.symbol)
				if (existingIndex === -1) {
					acc.push(coin)
				} else {
					// Update existing coin with newer data
					acc[existingIndex] = coin
				}
				return acc
			}, [])

			state.losers = uniqueLosers
				.slice()
				.sort((a, b) => a.percentChange - b.percentChange)
				.slice(0, MAX_ITEMS)
		},
		clearTimeframeData: () => initialState
	}
})

export const { replaceTimeframeGainers, replaceTimeframeLosers, clearTimeframeData } = timeframeSlice.actions

export default timeframeSlice.reducer 