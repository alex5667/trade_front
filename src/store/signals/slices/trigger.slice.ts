/**
 * Слайс триггерных событий
 * ------------------------------
 * Redux слайс для управления триггерными событиями пользовательского интерфейса
 * Обрабатывает уведомления о необходимости обновления данных в UI компонентах
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TriggerEvent, TriggersData } from '../signal.types'

const initialState: TriggersData = {
	gainers: [],
	losers: []
}

const MAX_TRIGGERS = 10

export const triggerSlice = createSlice({
	name: 'trigger',
	initialState,
	reducers: {
		addTriggerEvent: (state, action: PayloadAction<TriggerEvent>) => {
			const { type, data } = action.payload
			if (Array.isArray(data)) {
				state[type] = data.slice(0, MAX_TRIGGERS)
			} else if (typeof data === 'string') {
				if (!state[type].includes(data)) {
					state[type].unshift(data)
					if (state[type].length > MAX_TRIGGERS) state[type].pop()
				}
			}
		},
		clearTriggers: () => initialState
	}
})

export const { addTriggerEvent, clearTriggers } = triggerSlice.actions

export default triggerSlice.reducer 