/**
 * Timeframe Slice
 * ------------------------------
 * Redux slice for timeframe-related data
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TimeframeCoin, TimeframeData, VolumeSignal } from '../signal.types'

const initialState: TimeframeData = {
	'5min': {
		gainers: [],
		losers: [],
		volume: []
	},
	'24h': {
		gainers: [],
		losers: []
	}
}

// Maximum number of items to keep in each timeframe category
const MAX_ITEMS = 20

export const timeframeSlice = createSlice({
	name: 'timeframe',
	initialState,
	reducers: {
		addTimeframeGainer: (
			state,
			action: PayloadAction<{
				timeframe: '5min' | '24h'
				data: TimeframeCoin
			}>
		) => {
			const { timeframe, data } = action.payload
			console.log(`💰 Adding timeframe gainer: ${data.symbol} (${data.percentChange.toFixed(2)}%) to ${timeframe}`)

			// Check if the coin already exists
			const existingIndex = state[timeframe].gainers.findIndex(
				(coin) => coin.symbol === data.symbol
			)

			if (existingIndex >= 0) {
				// Update existing coin
				state[timeframe].gainers[existingIndex] = data
			} else {
				// Add new coin
				state[timeframe].gainers.push(data)
			}

			// Sort by descending percent change (highest first)
			state[timeframe].gainers.sort(
				(a, b) => b.percentChange - a.percentChange
			)

			// Limit the number of items
			if (state[timeframe].gainers.length > MAX_ITEMS) {
				state[timeframe].gainers = state[timeframe].gainers.slice(0, MAX_ITEMS)
			}
		},

		addTimeframeLoser: (
			state,
			action: PayloadAction<{
				timeframe: '5min' | '24h'
				data: TimeframeCoin
			}>
		) => {
			const { timeframe, data } = action.payload
			console.log(`📉 Adding timeframe loser: ${data.symbol} (${data.percentChange.toFixed(2)}%) to ${timeframe}`)

			// Check if the coin already exists
			const existingIndex = state[timeframe].losers.findIndex(
				(coin) => coin.symbol === data.symbol
			)

			if (existingIndex >= 0) {
				// Update existing coin
				state[timeframe].losers[existingIndex] = data
			} else {
				// Add new coin
				state[timeframe].losers.push(data)
			}

			// Sort by ascending percent change (lowest first)
			state[timeframe].losers.sort(
				(a, b) => a.percentChange - b.percentChange
			)

			// Limit the number of items
			if (state[timeframe].losers.length > MAX_ITEMS) {
				state[timeframe].losers = state[timeframe].losers.slice(0, MAX_ITEMS)
			}
		},

		addTimeframeVolume: (
			state,
			action: PayloadAction<{
				timeframe: '5min'
				data: VolumeSignal
			}>
		) => {
			const { data } = action.payload
			console.log(`📊 Adding timeframe volume: ${data.symbol} (${data.volumeChange.toFixed(2)}) to 5min`)

			// Check if the coin already exists
			const existingIndex = state['5min'].volume.findIndex(
				(coin) => coin.symbol === data.symbol
			)

			if (existingIndex >= 0) {
				// Update existing coin
				state['5min'].volume[existingIndex] = data
			} else {
				// Add new coin
				state['5min'].volume.push(data)
			}

			// Sort by descending volume change (highest first)
			state['5min'].volume.sort(
				(a, b) => b.volumeChange - a.volumeChange
			)

			// Limit the number of items
			if (state['5min'].volume.length > MAX_ITEMS) {
				state['5min'].volume = state['5min'].volume.slice(0, MAX_ITEMS)
			}
		},

		clearTimeframeData: (state) => {
			console.log('🧹 Clearing all timeframe data')
			// Reset to initial state
			return initialState
		}
	}
})

export const {
	addTimeframeGainer,
	addTimeframeLoser,
	addTimeframeVolume,
	clearTimeframeData
} = timeframeSlice.actions

export default timeframeSlice.reducer 