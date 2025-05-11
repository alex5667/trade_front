/**
 * Trigger Slice
 * ------------------------------
 * Redux slice for UI trigger events
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TriggerEvent, TriggersData } from '../signal.types'

const initialState: TriggersData = {
	'5min': {
		gainers: [],
		losers: [],
		volume: [],
		funding: []
	},
	'24h': {
		gainers: [],
		losers: []
	}
}

// Maximum number of triggers to keep for each category
const MAX_TRIGGERS = 10

export const triggerSlice = createSlice({
	name: 'trigger',
	initialState,
	reducers: {
		addTriggerEvent: (
			state,
			action: PayloadAction<TriggerEvent>
		) => {
			const { timeframe, type, data } = action.payload

			// Ensure valid timeframe and type combination
			if (
				(timeframe === '5min' && ['gainers', 'losers', 'volume', 'funding'].includes(type)) ||
				(timeframe === '24h' && ['gainers', 'losers'].includes(type))
			) {
				if (Array.isArray(data)) {
					// If data is an array, replace the current triggers
					console.log(`🔔 Setting ${timeframe} ${type} triggers: ${data.length} items`)
					// @ts-ignore - Type checked above
					state[timeframe][type] = data.slice(0, MAX_TRIGGERS)
				} else if (typeof data === 'string') {
					// If data is a string and not already in the array, add it
					// @ts-ignore - Type checked above
					if (!state[timeframe][type].includes(data)) {
						console.log(`🔔 Adding single ${timeframe} ${type} trigger: ${data}`)
						// @ts-ignore - Type checked above
						state[timeframe][type].unshift(data)

						// Limit array size
						// @ts-ignore - Type checked above
						if (state[timeframe][type].length > MAX_TRIGGERS) {
							// @ts-ignore - Type checked above
							state[timeframe][type].pop()
						}
					}
				}
			} else {
				console.warn(`⚠️ Invalid trigger combination: ${timeframe} ${type}`)
			}
		},

		clearTriggers: (state) => {
			console.log('🧹 Clearing all triggers')
			return initialState
		},

		clearTimeframeTriggers: (state, action: PayloadAction<'5min' | '24h'>) => {
			const timeframe = action.payload
			console.log(`🧹 Clearing triggers for timeframe: ${timeframe}`)

			// Create a new object with empty arrays
			if (timeframe === '5min') {
				state['5min'] = {
					gainers: [],
					losers: [],
					volume: [],
					funding: []
				}
			} else {
				state['24h'] = {
					gainers: [],
					losers: []
				}
			}
		}
	}
})

export const {
	addTriggerEvent,
	clearTriggers,
	clearTimeframeTriggers
} = triggerSlice.actions

export default triggerSlice.reducer 