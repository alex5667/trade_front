/**
 * Signal API
 * ------------------------------
 * RTK Query API для получения торговых сигналов с сервера
 * Используется для инициализации store начальными данными
 */

import { URLS } from '@/config/urls'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './baseQueries'

// Создаем API для получения сигналов
export const signalApi = createApi({
	reducerPath: 'signalApi',
	baseQuery,
	tagTypes: ['Signal'],
	endpoints: (builder) => ({
		// Получение топ-гейнеров (trade_back)
		getTopGainers: builder.query({
			query: () => ({
				url: URLS.TOP_GAINERS,
				method: 'GET',
			}),
			providesTags: ['Signal'],
			transformResponse: (response: any) => {
				console.log('Top gainers fetched:', response)
				return response?.data ?? response
			},
			transformErrorResponse: (err: any) => {
				console.log('Failed to fetch top gainers:', err)
				return err
			},
		}),

		// Получение топ-лузеров (trade_back)
		getTopLosers: builder.query({
			query: () => ({
				url: URLS.TOP_LOSERS,
				method: 'GET',
			}),
			providesTags: ['Signal'],
			transformResponse: (response: any) => {
				console.log('Top losers fetched:', response)
				return response?.data ?? response
			},
			transformErrorResponse: (err: any) => {
				console.log('Failed to fetch top losers:', err)
				return err
			},
		}),

		// Получение сигналов волатильности (оставлено без изменений)
		getVolatilitySignals: builder.query({
			query: () => ({
				url: URLS.SIGNALS + '/volatility',
				method: 'GET',
			}),
			providesTags: ['Signal'],
			transformResponse: (response: any) => {
				console.log('Volatility signals fetched:', response)
				return response
			},
			transformErrorResponse: (err: any) => {
				console.log('Failed to fetch volatility signals:', err)
				return err
			},
		}),

		// Получение сигналов объема (trade_back)
		getVolumeSignals: builder.query({
			query: () => ({
				url: URLS.VOLUME_SIGNALS,
				method: 'GET',
			}),
			providesTags: ['Signal'],
			transformResponse: (response: any) => {
				console.log('Volume signals fetched:', response)
				return response
			},
			transformErrorResponse: (err: any) => {
				console.log('Failed to fetch volume signals:', err)
				return err
			},
		}),

		// Получение сигналов финансирования (trade_back)
		getFundingSignals: builder.query({
			query: () => ({
				url: URLS.FUNDING_SIGNALS,
				method: 'GET',
			}),
			providesTags: ['Signal'],
			transformResponse: (response: any) => {
				console.log('Funding signals fetched:', response)
				return response
			},
			transformErrorResponse: (err: any) => {
				console.log('Failed to fetch funding signals:', err)
				return err
			},
		}),

		// Получение всех сигналов (не используется, агрегатора на backend нет)
		getAllSignals: builder.query({
			query: () => ({
				url: URLS.SIGNALS,
				method: 'GET',
			}),
			providesTags: ['Signal'],
			transformResponse: (response: any) => {
				console.log('All signals fetched:', response)
				return response
			},
			transformErrorResponse: (err: any) => {
				console.log('Failed to fetch all signals:', err)
				return err
			},
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
	useGetAllSignalsQuery,
} = signalApi 