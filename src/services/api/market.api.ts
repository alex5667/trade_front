/**
 * Market API
 * ------------------------------
 * API для получения рыночных данных с сервера
 */
import { createApi } from '@reduxjs/toolkit/query/react'

import { URLS } from '@/config/urls'
import { AllTradingData } from '@/types/all-traiding.types'
import { baseQueryWIthReAuth } from '../baseQueries'

// Интерфейс для параметров запроса
interface GetMarketsQueryParams {
	limit?: number
	offset?: number
	sort?: string
}

// Создаем API для получения рыночных данных
export const marketApi = createApi({
	reducerPath: 'marketApi',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['market'],
	endpoints: builder => ({
		// Запрос для получения рыночных данных
		getMarkets: builder.query<AllTradingData, GetMarketsQueryParams>({
			query: (params) => ({
				url: URLS.MARKET_ALL,
				method: 'GET',
				params
			}),
			providesTags: ['market'],
			onQueryStarted: async (arg, { queryFulfilled }) => {
				try {
					const { data } = await queryFulfilled
					console.log('Market data fetched:', data)
				} catch (err) {
					console.error('Failed to fetch market data:', err)
				}
			}
		})
	})
})

// Экспортируем хук для использования в компонентах
export const { useGetMarketsQuery } = marketApi 