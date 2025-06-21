/**
 * Слайс триггерных событий
 * ------------------------------
 * Redux слайс для управления триггерными событиями пользовательского интерфейса
 * Обрабатывает уведомления о необходимости обновления данных в UI компонентах
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TriggerEvent, TriggersData } from '../signal.types'

/** Начальное состояние триггерных событий */
const initialState: TriggersData = {
	'24h': {
		gainers: [],
		losers: []
	}
}

/** Максимальное количество триггеров для каждой категории */
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

			// Проверяем валидность комбинации таймфрейма и типа
			if (timeframe === '24h' && ['gainers', 'losers'].includes(type)) {
				if (Array.isArray(data)) {
					// Если данные - массив, заменяем текущие триггеры
					console.log(`🔔 Setting ${timeframe} ${type} triggers: ${data.length} items`)
					// @ts-ignore - Тип проверен выше
					state[timeframe][type] = data.slice(0, MAX_TRIGGERS)
				} else if (typeof data === 'string') {
					// Если данные - строка и её нет в массиве, добавляем
					// @ts-ignore - Тип проверен выше
					if (!state[timeframe][type].includes(data)) {
						console.log(`🔔 Adding single ${timeframe} ${type} trigger: ${data}`)
						// @ts-ignore - Тип проверен выше
						state[timeframe][type].unshift(data)

						// Ограничиваем размер массива
						// @ts-ignore - Тип проверен выше
						if (state[timeframe][type].length > MAX_TRIGGERS) {
							// @ts-ignore - Тип проверен выше
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

		clearTimeframeTriggers: (state, action: PayloadAction<'24h'>) => {
			const timeframe = action.payload
			console.log(`🧹 Clearing triggers for timeframe: ${timeframe}`)

			// Создаем новый объект с пустыми массивами
			state['24h'] = {
				gainers: [],
				losers: []
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