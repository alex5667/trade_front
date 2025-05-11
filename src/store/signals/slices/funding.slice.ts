/**
 * Funding Slice
 * ------------------------------
 * Redux slice for funding rate data
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FundingCoin } from '../signal.types'

interface FundingState {
	coins: FundingCoin[]
	lastUpdated: number
}

const initialState: FundingState = {
	coins: [],
	lastUpdated: 0
}

// Maximum number of funding coins to keep
const MAX_COINS = 20

export const fundingSlice = createSlice({
	name: 'funding',
	initialState,
	reducers: {
		addFundingData: (state, action: PayloadAction<{ data: FundingCoin }>) => {
			const { data } = action.payload
			console.log(`💱 Adding funding data: ${data.symbol} (rate: ${data.rate.toFixed(4)}%)`)

			// Check if the coin already exists
			const existingIndex = state.coins.findIndex(
				(coin) => coin.symbol === data.symbol
			)

			if (existingIndex >= 0) {
				// Update existing coin
				state.coins[existingIndex] = data
			} else {
				// Add new coin
				state.coins.push(data)
			}

			// Sort by absolute rate value (highest first)
			state.coins.sort((a, b) => Math.abs(b.rate) - Math.abs(a.rate))

			// Limit the number of coins
			if (state.coins.length > MAX_COINS) {
				state.coins = state.coins.slice(0, MAX_COINS)
			}

			// Update lastUpdated timestamp
			state.lastUpdated = Date.now()
		},

		clearFundingData: (state) => {
			console.log('🧹 Clearing all funding data')
			state.coins = []
			state.lastUpdated = Date.now()
		}
	}
})

export const {
	addFundingData,
	clearFundingData
} = fundingSlice.actions

export default fundingSlice.reducer 