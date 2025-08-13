import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface TelegramChannelsState {
	channels: any[]
	lastUpdated: number | null
}

const initialState: TelegramChannelsState = {
	channels: [],
	lastUpdated: null,
}

export const telegramChannelsSlice = createSlice({
	name: 'telegramChannels',
	initialState,
	reducers: {
		setTelegramChannels: (state, action: PayloadAction<any[]>) => {
			state.channels = Array.isArray(action.payload) ? action.payload : []
			state.lastUpdated = Date.now()
		},
	},
})

export const { setTelegramChannels } = telegramChannelsSlice.actions
export default telegramChannelsSlice.reducer 