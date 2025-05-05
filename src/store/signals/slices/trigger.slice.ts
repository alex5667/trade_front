/**
 * Trigger Signals Slice
 * ------------------------------
 * Redux slice for trigger signals (coin alerts)
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TriggerState {
	triggerGainers5min: string[]
	triggerLosers5min: string[]
	triggerVolume5min: string[]
	triggerFunding5min: string[]
	triggerGainers24h: string[]
	triggerLosers24h: string[]
}

const initialState: TriggerState = {
	triggerGainers5min: [],
	triggerLosers5min: [],
	triggerVolume5min: [],
	triggerFunding5min: [],
	triggerGainers24h: [],
	triggerLosers24h: []
}

export const triggerSlice = createSlice({
	name: 'trigger',
	initialState,
	reducers: {
		setTriggerGainers5min: (state, action: PayloadAction<string[]>) => {
			state.triggerGainers5min = action.payload
		},
		setTriggerLosers5min: (state, action: PayloadAction<string[]>) => {
			state.triggerLosers5min = action.payload
		},
		setTriggerVolume5min: (state, action: PayloadAction<string[]>) => {
			state.triggerVolume5min = action.payload
		},
		setTriggerFunding5min: (state, action: PayloadAction<string[]>) => {
			state.triggerFunding5min = action.payload
		},
		setTriggerGainers24h: (state, action: PayloadAction<string[]>) => {
			state.triggerGainers24h = action.payload
		},
		setTriggerLosers24h: (state, action: PayloadAction<string[]>) => {
			state.triggerLosers24h = action.payload
		}
	}
})

export const {
	setTriggerGainers5min,
	setTriggerLosers5min,
	setTriggerVolume5min,
	setTriggerFunding5min,
	setTriggerGainers24h,
	setTriggerLosers24h
} = triggerSlice.actions

export default triggerSlice.reducer 