/**
 * Timeframe Data Slice
 * ------------------------------
 * Redux slice for timeframe-based data (gainers/losers)
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FundingCoin, TimeframeCoin, VolumeCoin } from '../signal.types'

interface TimeframeState {
	// 5min timeframe data
	topGainers5min: TimeframeCoin[]
	topLosers5min: TimeframeCoin[]
	topVolume5min: VolumeCoin[]
	topFunding5min: FundingCoin[]

	// 24h timeframe data
	topGainers24h: TimeframeCoin[]
	topLosers24h: TimeframeCoin[]
}

const initialState: TimeframeState = {
	topGainers5min: [],
	topLosers5min: [],
	topVolume5min: [],
	topFunding5min: [],
	topGainers24h: [],
	topLosers24h: []
}

export const timeframeSlice = createSlice({
	name: 'timeframe',
	initialState,
	reducers: {
		setTopGainers5min: (state, action: PayloadAction<TimeframeCoin[]>) => {
			state.topGainers5min = action.payload
		},
		setTopLosers5min: (state, action: PayloadAction<TimeframeCoin[]>) => {
			state.topLosers5min = action.payload
		},
		setTopVolume5min: (state, action: PayloadAction<VolumeCoin[]>) => {
			state.topVolume5min = action.payload
		},
		setTopFunding5min: (state, action: PayloadAction<FundingCoin[]>) => {
			state.topFunding5min = action.payload
		},
		setTopGainers24h: (state, action: PayloadAction<TimeframeCoin[]>) => {
			state.topGainers24h = action.payload
		},
		setTopLosers24h: (state, action: PayloadAction<TimeframeCoin[]>) => {
			state.topLosers24h = action.payload
		}
	}
})

export const {
	setTopGainers5min,
	setTopLosers5min,
	setTopVolume5min,
	setTopFunding5min,
	setTopGainers24h,
	setTopLosers24h
} = timeframeSlice.actions

export default timeframeSlice.reducer 