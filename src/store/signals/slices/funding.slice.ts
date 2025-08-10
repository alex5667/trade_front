/**
 * Слайс данных финансирования
 * ------------------------------
 * Redux слайс для управления данными ставок финансирования фьючерсных контрактов
 * Отслеживает ставки финансирования различных торговых пар
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FundingCoin } from '../signal.types'

/** Интерфейс состояния данных финансирования */
interface FundingState {
	/** Массив монет с данными финансирования */
	coins: FundingCoin[]
	/** Время последнего обновления */
	lastUpdated: number
}

/** Начальное состояние данных финансирования */
const initialState: FundingState = {
	coins: [],
	lastUpdated: 0
}

/** Максимальное количество монет для отслеживания финансирования */
const MAX_COINS = 20

export const fundingSlice = createSlice({
	name: 'funding',
	initialState,
	reducers: {
		addFundingData: (state, action: PayloadAction<{ data: FundingCoin }>) => {
			const { data } = action.payload
			console.log(`💱 Adding funding data: ${data.symbol} (rate: ${data.rate.toFixed(4)}%)`)

			// Проверяем, существует ли уже монета с таким символом
			const existingIndex = state.coins.findIndex(
				(coin) => coin.symbol === data.symbol
			)

			if (existingIndex >= 0) {
				// Обновляем существующую монету
				state.coins[existingIndex] = data
			} else {
				// Добавляем новую монету
				state.coins.push(data)
			}

			// Сортируем по абсолютному значению ставки (наибольшие ставки сначала)
			state.coins.sort((a, b) => Math.abs(b.rate) - Math.abs(a.rate))

			// Ограничиваем количество монет
			if (state.coins.length > MAX_COINS) {
				state.coins = state.coins.slice(0, MAX_COINS)
			}

			// Обновляем время последнего обновления
			state.lastUpdated = Date.now()
		},
		replaceFundingData: (state, action: PayloadAction<FundingCoin[]>) => {
			state.coins = (action.payload || [])
				.slice()
				.sort((a, b) => Math.abs(b.rate) - Math.abs(a.rate))
				.slice(0, MAX_COINS)
			state.lastUpdated = Date.now()
		},
		clearFundingData: (state) => {
			console.log('🧹 Clearing all funding data')
			state.coins = []
			state.lastUpdated = Date.now()
		}
	}
})

export const {
	addFundingData,
	replaceFundingData,
	clearFundingData
} = fundingSlice.actions

export default fundingSlice.reducer 