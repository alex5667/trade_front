import { createApi } from '@reduxjs/toolkit/query/react'

import { URLS } from '@/config/urls'
import { setTelegramSignals } from '@/store/signals/slices/telegram.slice'
import { baseQueryWIthReAuth } from './baseQueries'

export const telegramApi = createApi({
	reducerPath: 'telegramApi',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['TelegramSignal'],
	endpoints: (builder) => ({
		getTelegramSignals: builder.query<any, { date?: string } | void>({
			query: (args) => {
				const date = (args as any)?.date
				const query = date ? `?date=${encodeURIComponent(date)}` : ''
				return {
					url: URLS.TELEGRAM_SIGNALS + query,
					method: 'GET',
				}
			},
			providesTags: ['TelegramSignal'],
			transformResponse: (response: any) => {
				return response?.data ?? response
			},
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled
					const signals = Array.isArray(data) ? data : (data?.signals || [])
					dispatch(setTelegramSignals(signals))
				} catch (e) { }
			},
		}),
		getTelegramSignalsByRange: builder.query<any, { start: string; end: string; limit?: number; offset?: number; symbol?: string; direction?: string; timeframe?: string; exchange?: string; username?: string; chatId?: string }>(
			{
				query: (params) => ({
					url: URLS.TELEGRAM_SIGNALS + '/range',
					method: 'GET',
					params,
				}),
				providesTags: ['TelegramSignal'],
				transformResponse: (response: any) => response?.data ?? response,
				async onQueryStarted(arg, { dispatch, queryFulfilled }) {
					try {
						const { data } = await queryFulfilled
						const signals = Array.isArray(data) ? data : (data?.signals || [])
						dispatch(setTelegramSignals(signals))
					} catch (e) { }
				},
			}
		),
	})
})

export const { useGetTelegramSignalsQuery, useGetTelegramSignalsByRangeQuery } = telegramApi 