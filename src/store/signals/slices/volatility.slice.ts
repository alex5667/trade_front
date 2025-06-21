/**
 * Слайс сигналов волатильности
 * ------------------------------
 * Redux слайс для всех сигналов волатильности (комбинированный)
 * Этот слайс сохранен для обратной совместимости и 
 * перенаправляет сигналы в соответствующие специализированные слайсы
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { VolatilitySignal } from '../signal.types'

/** Интерфейс состояния сигналов волатильности */
interface VolatilityState {
	/** Массив сигналов волатильности */
	signals: VolatilitySignal[]
	/** Время последнего обновления */
	lastUpdated: number
}

/** Начальное состояние сигналов волатильности */
const initialState: VolatilityState = {
	signals: [],
	lastUpdated: 0
}

/** Максимальное количество сигналов для улучшения производительности */
const MAX_SIGNALS = 50

export const volatilitySlice = createSlice({
	name: 'volatility',
	initialState,
	reducers: {
		addVolatilitySignal: (state, action: PayloadAction<VolatilitySignal>) => {
			const signal = action.payload
			console.log(`💾 Adding volatility signal to store: ${signal.symbol}, type: ${signal.signalType || 'volatility'}`)

			// Проверяем, существует ли уже сигнал с тем же символом и временной меткой
			const existingIndex = state.signals.findIndex(
				existingSignal =>
					existingSignal.symbol === signal.symbol &&
					existingSignal.timestamp === signal.timestamp &&
					existingSignal.signalType === signal.signalType
			)

			if (existingIndex !== -1) {
				// Обновляем существующий сигнал вместо добавления нового
				console.log(`🔄 Updating existing signal at index ${existingIndex}`)
				state.signals[existingIndex] = {
					...signal,
					// Сохраняем время создания из оригинального сигнала
					createdAt: state.signals[existingIndex].createdAt || Date.now()
				}
			} else {
				// Добавляем новый сигнал в начало массива с временной меткой создания
				console.log(`➕ Adding new signal, current count: ${state.signals.length}`)
				state.signals.unshift({
					...signal,
					createdAt: Date.now()
				})

				// Сохраняем только самые свежие сигналы для предотвращения роста состояния
				if (state.signals.length > MAX_SIGNALS) {
					console.log(`✂️ Trimming signals array to ${MAX_SIGNALS} items`)
					state.signals.length = MAX_SIGNALS
				}
			}

			// Логируем текущее количество сигналов
			console.log(`📊 Current volatility signals count: ${state.signals.length}`)

			// Обновляем время последнего обновления
			state.lastUpdated = Date.now()
		},
		clearVolatilitySignals: (state) => {
			console.log(`🧹 Clearing all volatility signals`)
			state.signals = []
			state.lastUpdated = Date.now()
		}
	}
})

export const {
	addVolatilitySignal,
	clearVolatilitySignals
} = volatilitySlice.actions

export default volatilitySlice.reducer 