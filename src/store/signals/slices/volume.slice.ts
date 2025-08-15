/**
 * Слайс сигналов объема
 * ------------------------------
 * Redux слайс для управления сигналами всплесков объема торгов
 * Отслеживает резкие изменения объема торговых операций
 */

import type { VolumeSignalPrisma } from '@/types/signal.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/** Интерфейс состояния сигналов объема */
interface VolumeState {
	/** Массив сигналов объема */
	signals: VolumeSignalPrisma[]
	/** Время последнего обновления */
	lastUpdated: number
}

/** Начальное состояние сигналов объема */
const initialState: VolumeState = {
	signals: [],
	lastUpdated: 0
}

/** Максимальное количество сигналов для улучшения производительности */
const MAX_SIGNALS = 10

export const volumeSlice = createSlice({
	name: 'volume',
	initialState,
	reducers: {
		addVolumeSignal: (state, action: PayloadAction<VolumeSignalPrisma>) => {
			const signal = action.payload

			console.log(`💾 Adding volume signal to store: ${signal.symbol}`)

			// Проверяем, существует ли уже сигнал с тем же символом и временной меткой
			const existingIndex = state.signals.findIndex(
				existingSignal =>
					existingSignal.symbol === signal.symbol &&
					existingSignal.timestamp === signal.timestamp
			)

			if (existingIndex !== -1) {
				// Обновляем существующий сигнал вместо добавления нового
				console.log(`🔄 Updating existing volume signal at index ${existingIndex}`)
				state.signals[existingIndex] = {
					...signal,
					// Сохраняем время создания из оригинального сигнала
					createdAt: state.signals[existingIndex].createdAt || new Date().toISOString()
				}
			} else {
				// Добавляем новый сигнал в начало массива с временной меткой создания
				console.log(`➕ Adding new volume signal, current count: ${state.signals.length}`)
				state.signals.unshift({
					...signal,
					createdAt: new Date().toISOString()
				})

				// Сохраняем только самые свежие сигналы для предотвращения роста состояния
				if (state.signals.length > MAX_SIGNALS) {
					console.log(`✂️ Trimming volume signals array to ${MAX_SIGNALS} items`)
					state.signals.length = MAX_SIGNALS
				}
			}

			// Логируем текущее количество сигналов
			console.log(`📊 Current volume signals count: ${state.signals.length}`)

			// Обновляем время последнего обновления
			state.lastUpdated = Date.now()
		},
		replaceVolumeSignals: (state, action: PayloadAction<VolumeSignalPrisma[]>) => {
			state.signals = (action.payload || []).map(s => ({
				...s,
				createdAt: s.createdAt || new Date().toISOString()
			}))
			state.lastUpdated = Date.now()
		},
		clearVolumeSignals: (state) => {
			console.log(`🧹 Clearing all volume signals`)
			state.signals = []
			state.lastUpdated = Date.now()
		}
	}
})

export const {
	addVolumeSignal,
	replaceVolumeSignals,
	clearVolumeSignals
} = volumeSlice.actions

export default volumeSlice.reducer 