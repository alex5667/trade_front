import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface TelegramState {
	signals: any[]
	lastUpdated: number | null
}

const initialState: TelegramState = {
	signals: [],
	lastUpdated: null,
}

export const telegramSlice = createSlice({
	name: 'telegram',
	initialState,
	reducers: {
		setTelegramSignals: (state, action: PayloadAction<any[]>) => {
			state.signals = Array.isArray(action.payload) ? action.payload : []
			state.lastUpdated = Date.now()
		},
	},
})

export const { setTelegramSignals } = telegramSlice.actions
export default telegramSlice.reducer 