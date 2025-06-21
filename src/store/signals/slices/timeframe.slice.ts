/**
 * Слайс таймфреймов
 * ------------------------------
 * Redux слайс для данных по 24-часовому временному интервалу
 * Управляет топами растущих/падающих активов
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TimeframeCoin, TimeframeData } from '../signal.types'

/** Начальное состояние данных таймфреймов */
const initialState: TimeframeData = {
	'24h': {
		gainers: [],
		losers: []
	}
}

/** Максимальное количество элементов в каждой категории таймфрейма */
const MAX_ITEMS = 20

export const timeframeSlice = createSlice({
	name: 'timeframe',
	initialState,
	reducers: {
		addTimeframeGainer: (
			state,
			action: PayloadAction<{
				timeframe: '24h'
				data: TimeframeCoin
			}>
		) => {
			const { timeframe, data } = action.payload
			console.log(`💰 Adding timeframe gainer: ${data.symbol} (${data.percentChange.toFixed(2)}%) to ${timeframe}`)

			// Проверяем, существует ли уже монета с таким символом
			const existingIndex = state[timeframe].gainers.findIndex(
				(coin) => coin.symbol === data.symbol
			)

			if (existingIndex >= 0) {
				// Обновляем существующую монету
				state[timeframe].gainers[existingIndex] = data
			} else {
				// Добавляем новую монету
				state[timeframe].gainers.push(data)
			}

			// Сортируем по убыванию процентного изменения (наибольший рост сначала)
			state[timeframe].gainers.sort(
				(a, b) => b.percentChange - a.percentChange
			)

			// Ограничиваем количество элементов
			if (state[timeframe].gainers.length > MAX_ITEMS) {
				state[timeframe].gainers = state[timeframe].gainers.slice(0, MAX_ITEMS)
			}
		},

		addTimeframeLoser: (
			state,
			action: PayloadAction<{
				timeframe: '24h'
				data: TimeframeCoin
			}>
		) => {
			const { timeframe, data } = action.payload
			console.log(`📉 Adding timeframe loser: ${data.symbol} (${data.percentChange.toFixed(2)}%) to ${timeframe}`)

			// Проверяем, существует ли уже монета с таким символом
			const existingIndex = state[timeframe].losers.findIndex(
				(coin) => coin.symbol === data.symbol
			)

			if (existingIndex >= 0) {
				// Обновляем существующую монету
				state[timeframe].losers[existingIndex] = data
			} else {
				// Добавляем новую монету
				state[timeframe].losers.push(data)
			}

			// Сортируем по возрастанию процентного изменения (наибольшее падение сначала)
			state[timeframe].losers.sort(
				(a, b) => a.percentChange - b.percentChange
			)

			// Ограничиваем количество элементов
			if (state[timeframe].losers.length > MAX_ITEMS) {
				state[timeframe].losers = state[timeframe].losers.slice(0, MAX_ITEMS)
			}
		},

		clearTimeframeData: (state) => {
			console.log('🧹 Clearing all timeframe data')
			// Сброс к начальному состоянию
			return initialState
		}
	}
})

export const {
	addTimeframeGainer,
	addTimeframeLoser,
	clearTimeframeData
} = timeframeSlice.actions

export default timeframeSlice.reducer 