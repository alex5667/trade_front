/**
 * Signal API
 * ------------------------------
 * RTK Query API для получения торговых сигналов с сервера
 * Используется для инициализации store начальными данными
 */

import { URLS } from '@/config/urls'
import type { FundingSignalPrisma, GainerSignal, LoserSignal, TopMoveItem, VolatilitySpikeSignal, VolumeSignalPrisma } from '@/types/signal.types'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWIthReAuth } from './baseQueries'

// Создаем API для получения сигналов
export const signalApi = createApi({
	reducerPath: 'signalApi',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['Signal'],
	endpoints: (builder) => ({
		// Получение топ-гейнеров (aggregated)
		getTopGainers: builder.query<TopMoveItem[] | any, void>({
			query: () => ({ url: URLS.TOP_GAINERS, method: 'GET' }),
			providesTags: ['Signal'],
			transformResponse: (response: any) => response?.data ?? response,
		}),

		// Получение топ-лузеров (aggregated)
		getTopLosers: builder.query<TopMoveItem[] | any, void>({
			query: () => ({ url: URLS.TOP_LOSERS, method: 'GET' }),
			providesTags: ['Signal'],
			transformResponse: (response: any) => response?.data ?? response,
		}),

		// Полные записи гейнеров (Prisma GainerSignal)
		getGainerSignals: builder.query<GainerSignal[] | any, void>({
			query: () => ({ url: URLS.GAINER_SIGNALS, method: 'GET' }),
			providesTags: ['Signal'],
			transformResponse: (response: any) => response?.data ?? response,
		}),

		// Полные записи лузеров (Prisma LoserSignal)
		getLoserSignals: builder.query<LoserSignal[] | any, void>({
			query: () => ({ url: URLS.LOSER_SIGNALS, method: 'GET' }),
			providesTags: ['Signal'],
			transformResponse: (response: any) => response?.data ?? response,
		}),

		// Сигналы волатильности (spike) по Prisma
		getVolatilitySignals: builder.query<VolatilitySpikeSignal[] | any, void>({
			query: () => ({ url: URLS.VOLATILITY_SIGNALS, method: 'GET' }),
			providesTags: ['Signal'],
			transformResponse: (response: any) => response?.data ?? response,
		}),

		// Сигналы объема (Prisma)
		getVolumeSignals: builder.query<VolumeSignalPrisma[] | any, void>({
			query: () => ({ url: URLS.VOLUME_SIGNALS, method: 'GET', params: { limit: 10 } }),
			providesTags: ['Signal'],
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled
					if (data && Array.isArray(data)) {
						// Import dynamically to avoid circular imports
						const { replaceVolumeSignals } = await import('@/store/signals/slices/volume.slice')
						dispatch(replaceVolumeSignals(data))
					}
				} catch {
					// Ошибка обрабатывается RTK Query
				}
			},
		}),

		// Сигналы финансирования (Prisma)
		getFundingSignals: builder.query<FundingSignalPrisma[] | any, void>({
			query: () => ({ url: URLS.FUNDING_SIGNALS, method: 'GET', params: { limit: 10 } }),
			providesTags: ['Signal'],
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled
					if (data && Array.isArray(data)) {
						// Import dynamically to avoid circular imports
						const { replaceFundingData } = await import('@/store/signals/slices/funding.slice')
						dispatch(replaceFundingData(data))
					}
				} catch {
					// Ошибка обрабатывается RTK Query
				}
			},
		}),

		// Получение телеграм-сигналов по диапазону дат (legacy)
		getTelegramSignalsByDate: builder.query<any, { startDate?: string; endDate?: string; limit?: number; offset?: number; symbol?: string; direction?: string; timeframe?: string; exchange?: string; username?: string; chatId?: string }>({
			query: (params) => ({ url: URLS.TELEGRAM_SIGNALS + '/parsed', method: 'GET', params }),
			providesTags: ['Signal'],
			transformResponse: (response: any) => response,
		}),

		// Получение всех сигналов (не используется, агрегатора на backend нет)
		getAllSignals: builder.query<any, void>({
			query: () => ({ url: URLS.SIGNALS, method: 'GET' }),
			providesTags: ['Signal'],
		}),
	}),
})

// Экспортируем хуки для использования в компонентах
export const {
	useGetTopGainersQuery,
	useGetTopLosersQuery,
	useGetGainerSignalsQuery,
	useGetLoserSignalsQuery,
	useGetVolatilitySignalsQuery,
	useGetVolumeSignalsQuery,
	useGetFundingSignalsQuery,
	useGetTelegramSignalsByDateQuery,
	useGetAllSignalsQuery,
} = signalApi 