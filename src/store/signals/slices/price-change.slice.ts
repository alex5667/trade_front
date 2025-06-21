/**
 * Слайс сигналов изменения цены
 * ------------------------------
 * Redux слайс для управления сигналами резких изменений цены
 * Отслеживает значительные ценовые движения торговых инструментов
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PriceChangeSignal } from '../signal.types'

/** Интерфейс состояния сигналов изменения цены */
interface PriceChangeState {
	/** Массив сигналов изменения цены */
	signals: PriceChangeSignal[]
	/** Время последнего обновления */
	lastUpdated: number
}

/** Начальное состояние сигналов изменения цены */
const initialState: PriceChangeState = {
	signals: [],
	lastUpdated: 0
}

/** Максимальное количество сигналов для улучшения производительности */
const MAX_SIGNALS = 50

export const priceChangeSlice = createSlice({
	name: 'priceChange',
	initialState,
	reducers: {
		addPriceChangeSignal: (state, action: PayloadAction<PriceChangeSignal>) => {
			const signal = action.payload

			console.log(`💾 Adding price change signal to store: ${signal.symbol}, direction: ${signal.direction}`)

			// Проверяем, существует ли уже сигнал с тем же символом и временной меткой
			const existingIndex = state.signals.findIndex(
				existingSignal =>
					existingSignal.symbol === signal.symbol &&
					existingSignal.timestamp === signal.timestamp
			)

			if (existingIndex !== -1) {
				// Обновляем существующий сигнал вместо добавления нового
				console.log(`🔄 Updating existing price change signal at index ${existingIndex}`)
				state.signals[existingIndex] = {
					...signal,
					// Сохраняем время создания из оригинального сигнала
					createdAt: state.signals[existingIndex].createdAt || Date.now()
				}
			} else {
				// Добавляем новый сигнал в начало массива с временной меткой создания
				console.log(`➕ Adding new price change signal, current count: ${state.signals.length}`)
				state.signals.unshift({
					...signal,
					createdAt: Date.now()
				})

				// Сохраняем только самые свежие сигналы для предотвращения роста состояния
				if (state.signals.length > MAX_SIGNALS) {
					console.log(`✂️ Trimming price change signals array to ${MAX_SIGNALS} items`)
					state.signals.length = MAX_SIGNALS
				}
			}

			// Логируем текущее количество сигналов
			console.log(`📊 Current price change signals count: ${state.signals.length}`)

			// Обновляем время последнего обновления
			state.lastUpdated = Date.now()
		},
		clearPriceChangeSignals: (state) => {
			console.log(`🧹 Clearing all price change signals`)
			state.signals = []
			state.lastUpdated = Date.now()
		}
	}
})

export const {
	addPriceChangeSignal,
	clearPriceChangeSignals
} = priceChangeSlice.actions

export default priceChangeSlice.reducer 