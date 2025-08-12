/**
 * Signal API
 * ------------------------------
 * RTK Query API для получения торговых сигналов с сервера
 * Используется для инициализации store начальными данными
 */

import { URLS } from '@/config/urls'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWIthReAuth } from './baseQueries'

// Создаем API для получения сигналов
export const signalApi = createApi({
	reducerPath: 'signalApi',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['Signal'],
	endpoints: (builder) => ({
		// Получение топ-гейнеров (trade_back)
		getTopGainers: builder.query({
			query: () => ({ url: URLS.TOP_GAINERS, method: 'GET' }),
			providesTags: ['Signal'],
			transformResponse: (response: any) => response?.data ?? response,
		}),

		// Получение топ-лузеров (trade_back)
		getTopLosers: builder.query({
			query: () => ({ url: URLS.TOP_LOSERS, method: 'GET' }),
			providesTags: ['Signal'],
			transformResponse: (response: any) => response?.data ?? response,
		}),

		// Получение сигналов волатильности (оставлено без изменений)
		getVolatilitySignals: builder.query({
			query: () => ({ url: URLS.SIGNALS + '/volatility', method: 'GET' }),
			providesTags: ['Signal'],
		}),

		// Получение сигналов объема (trade_back)
		getVolumeSignals: builder.query({
			query: () => ({ url: URLS.VOLUME_SIGNALS, method: 'GET' }),
			providesTags: ['Signal'],
		}),

		// Получение сигналов финансирования (trade_back)
		getFundingSignals: builder.query({
			query: () => ({ url: URLS.FUNDING_SIGNALS, method: 'GET' }),
			providesTags: ['Signal'],
		}),

		// Получение телеграм-сигналов по диапазону дат
		getTelegramSignalsByDate: builder.query({
			query: (params: { startDate?: string; endDate?: string; limit?: number; offset?: number; symbol?: string; direction?: string; timeframe?: string; exchange?: string; username?: string; chatId?: string }) => ({
				url: URLS.TELEGRAM_SIGNALS + '/parsed',
				method: 'GET',
				params,
			}),
			providesTags: ['Signal'],
			transformResponse: (response: any) => response,
		}),

		// Получение всех сигналов (не используется, агрегатора на backend нет)
		getAllSignals: builder.query({
			query: () => ({ url: URLS.SIGNALS, method: 'GET' }),
			providesTags: ['Signal'],
		}),
	}),
})

// Экспортируем хуки для использования в компонентах
export const {
	useGetTopGainersQuery,
	useGetTopLosersQuery,
	useGetVolatilitySignalsQuery,
	useGetVolumeSignalsQuery,
	useGetFundingSignalsQuery,
	useGetTelegramSignalsByDateQuery,
	useGetAllSignalsQuery,
} = signalApi 