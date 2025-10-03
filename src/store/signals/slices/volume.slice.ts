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

/**
 * Сортирует сигналы объема по объему от большего к меньшему
 */
const sortSignalsByVolume = (signals: VolumeSignalPrisma[]): VolumeSignalPrisma[] => {
	return [...signals].sort((a, b) => {
		const volumeA = parseFloat(a.volume) || 0
		const volumeB = parseFloat(b.volume) || 0
		return volumeB - volumeA // Sort from highest to lowest
	})
}

export const volumeSlice = createSlice({
	name: 'volume',
	initialState,
	reducers: {
		addVolumeSignal: (state, action: PayloadAction<VolumeSignalPrisma>) => {
			const signal = action.payload

			console.log(`💾 Adding volume signal to store: ${signal.symbol}`)

			// Проверяем, существует ли уже сигнал с тем же символом
			const existingIndex = state.signals.findIndex(
				existingSignal => existingSignal.symbol === signal.symbol
			)

			if (existingIndex !== -1) {
				// Обновляем существующий сигнал вместо добавления нового
				console.log(`🔄 Updating existing volume signal for ${signal.symbol} at index ${existingIndex}`)
				state.signals[existingIndex] = {
					...signal,
					// Сохраняем время создания из оригинального сигнала
					createdAt: state.signals[existingIndex].createdAt || new Date().toISOString()
				}
			} else {
				// Добавляем новый сигнал в начало массива с временной меткой создания
				console.log(`➕ Adding new volume signal for ${signal.symbol}, current count: ${state.signals.length}`)
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

			// Сортируем сигналы по объему от большего к меньшему
			state.signals = sortSignalsByVolume(state.signals)

			// Логируем текущее количество сигналов
			console.log(`📊 Current volume signals count: ${state.signals.length}`)

			// Обновляем время последнего обновления
			state.lastUpdated = Date.now()
		},
		replaceVolumeSignals: (state, action: PayloadAction<VolumeSignalPrisma[]>) => {
			// Deduplicate signals by symbol before replacing
			const uniqueSignals = (action.payload || []).reduce((acc: VolumeSignalPrisma[], signal) => {
				const existingIndex = acc.findIndex(s => s.symbol === signal.symbol)
				if (existingIndex === -1) {
					acc.push({
						...signal,
						createdAt: signal.createdAt || new Date().toISOString()
					})
				} else {
					// Update existing signal with newer data
					acc[existingIndex] = {
						...signal,
						createdAt: acc[existingIndex].createdAt || new Date().toISOString()
					}
				}
				return acc
			}, [])

			state.signals = sortSignalsByVolume(uniqueSignals)
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