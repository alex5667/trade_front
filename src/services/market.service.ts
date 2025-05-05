import { createApi } from '@reduxjs/toolkit/query/react'

import { URLS } from '@/config/urls'
import { AllTradingData } from '@/types/all-traiding.types'
import { baseQueryWIthReAuth } from './baseQueries'

// export interface MarketData {
// 	id: string
// 	symbol: string
// 	price: number
// 	volume: number
// 	change24h: number
// 	high24h: number
// 	low24h: number
// 	lastUpdated: string
// }

// export interface MarketResponse {
// 	markets: MarketData[]
// 	total: number
// 	timestamp: number
// }

export const marketApi = createApi({
	reducerPath: 'marketApi',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['market'],
	endpoints: builder => ({
		getAllMarkets: builder.query<AllTradingData, void>({
			query: () => ({
				url: URLS.MARKET_ALL,
				method: 'GET'
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

export const { useGetAllMarketsQuery } = marketApi 