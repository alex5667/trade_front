import { createApi } from '@reduxjs/toolkit/query/react'

import { URLS } from '@/config/urls'
import type {
	CreateSymbolToRedisDto,
	GetSymbolsToRedisQuery,
	PaginatedSymbolsToRedisResponse,
	SymbolNormalization,
	SymbolSearchResult,
	SymbolToRedis,
	SymbolToRedisStats,
	UpdateSymbolToRedisDto
} from '@/types/symbol-to-redis.types'
import { baseQueryWIthReAuth } from './baseQueries'

export const symbolToRedisApi = createApi({
	reducerPath: 'symbolToRedisApi',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['SymbolToRedis'],
	endpoints: (builder) => ({
		// Получить символы с фильтрацией и пагинацией
		getSymbols: builder.query<PaginatedSymbolsToRedisResponse, GetSymbolsToRedisQuery>({
			query: (params) => ({
				url: URLS.SYMBOLS_TO_REDIS,
				method: 'GET',
				params
			}),
			providesTags: ['SymbolToRedis']
		}),

		// Получить символ по ID
		getSymbolById: builder.query<SymbolToRedis, string>({
			query: (id) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/${id}`,
				method: 'GET'
			}),
			providesTags: (result, error, id) => [{ type: 'SymbolToRedis', id }]
		}),

		// Создать символ
		createSymbol: builder.mutation<SymbolToRedis, CreateSymbolToRedisDto>({
			query: (data) => ({
				url: URLS.SYMBOLS_TO_REDIS,
				method: 'POST',
				body: data
			}),
			invalidatesTags: ['SymbolToRedis']
		}),

		// Обновить символ
		updateSymbol: builder.mutation<SymbolToRedis, { id: string; data: UpdateSymbolToRedisDto }>({
			query: ({ id, data }) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/${id}`,
				method: 'PUT',
				body: data
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: 'SymbolToRedis', id },
				{ type: 'SymbolToRedis' }
			]
		}),

		// Удалить символ
		deleteSymbol: builder.mutation<void, string>({
			query: (id) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/${id}`,
				method: 'DELETE'
			}),
			invalidatesTags: ['SymbolToRedis']
		}),

		// Поиск символов
		searchSymbols: builder.query<SymbolSearchResult[], { query: string; limit?: number }>({
			query: (params) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/search`,
				method: 'GET',
				params
			}),
			providesTags: ['SymbolToRedis']
		}),

		// Нормализация символа
		normalizeSymbol: builder.mutation<SymbolNormalization, { symbol: string }>({
			query: (data) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/normalize`,
				method: 'POST',
				body: data
			})
		}),

		// Получить статистику
		getStats: builder.query<SymbolToRedisStats, void>({
			query: () => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/stats`,
				method: 'GET'
			}),
			providesTags: ['SymbolToRedis']
		}),

		// Фильтрация по базовой валюте
		getSymbolsByBaseAsset: builder.query<SymbolToRedis[], string>({
			query: (baseAsset) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/base/${baseAsset}`,
				method: 'GET'
			}),
			providesTags: ['SymbolToRedis']
		}),

		// Фильтрация по котируемой валюте
		getSymbolsByQuoteAsset: builder.query<SymbolToRedis[], string>({
			query: (quoteAsset) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/quote/${quoteAsset}`,
				method: 'GET'
			}),
			providesTags: ['SymbolToRedis']
		}),

		// Фильтрация по типу инструмента
		getSymbolsByInstrumentType: builder.query<SymbolToRedis[], string>({
			query: (instrumentType) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/type/${instrumentType}`,
				method: 'GET'
			}),
			providesTags: ['SymbolToRedis']
		}),

		// Фильтрация по таймфрейму
		getSymbolsByTimeframe: builder.query<SymbolToRedis[], string>({
			query: (timeframe) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/timeframe/${timeframe}`,
				method: 'GET'
			}),
			providesTags: ['SymbolToRedis']
		}),

		// Redis операции
		getRedisSymbols: builder.query<SymbolToRedis[], void>({
			query: () => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/redis/all`,
				method: 'GET'
			}),
			providesTags: ['SymbolToRedis']
		}),

		getRedisSymbolsByBaseAsset: builder.query<SymbolToRedis[], string>({
			query: (baseAsset) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/redis/base/${baseAsset}`,
				method: 'GET'
			}),
			providesTags: ['SymbolToRedis']
		}),

		getRedisSymbolsByQuoteAsset: builder.query<SymbolToRedis[], string>({
			query: (quoteAsset) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/redis/quote/${quoteAsset}`,
				method: 'GET'
			}),
			providesTags: ['SymbolToRedis']
		}),

		getRedisSymbolsByInstrumentType: builder.query<SymbolToRedis[], string>({
			query: (instrumentType) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/redis/type/${instrumentType}`,
				method: 'GET'
			}),
			providesTags: ['SymbolToRedis']
		}),

		getRedisSymbolsByTimeframe: builder.query<SymbolToRedis[], string>({
			query: (timeframe) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/redis/timeframe/${timeframe}`,
				method: 'GET'
			}),
			providesTags: ['SymbolToRedis']
		}),

		getRedisSymbolDetails: builder.query<SymbolToRedis, string>({
			query: (symbol) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/redis/details/${symbol}`,
				method: 'GET'
			}),
			providesTags: ['SymbolToRedis']
		}),

		checkRedisSymbolExists: builder.query<boolean, string>({
			query: (symbol) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/redis/exists/${symbol}`,
				method: 'GET'
			}),
			providesTags: ['SymbolToRedis']
		}),

		getRedisStats: builder.query<SymbolToRedisStats, void>({
			query: () => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/redis/stats`,
				method: 'GET'
			}),
			providesTags: ['SymbolToRedis']
		}),

		clearRedisData: builder.mutation<void, void>({
			query: () => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/redis/clear`,
				method: 'DELETE'
			}),
			invalidatesTags: ['SymbolToRedis']
		})
	})
})

export const {
	useGetSymbolsQuery,
	useGetSymbolByIdQuery,
	useCreateSymbolMutation,
	useUpdateSymbolMutation,
	useDeleteSymbolMutation,
	useSearchSymbolsQuery,
	useNormalizeSymbolMutation,
	useGetStatsQuery,
	useGetSymbolsByBaseAssetQuery,
	useGetSymbolsByQuoteAssetQuery,
	useGetSymbolsByInstrumentTypeQuery,
	useGetSymbolsByTimeframeQuery,
	useGetRedisSymbolsQuery,
	useGetRedisSymbolsByBaseAssetQuery,
	useGetRedisSymbolsByQuoteAssetQuery,
	useGetRedisSymbolsByInstrumentTypeQuery,
	useGetRedisSymbolsByTimeframeQuery,
	useGetRedisSymbolDetailsQuery,
	useCheckRedisSymbolExistsQuery,
	useGetRedisStatsQuery,
	useClearRedisDataMutation
} = symbolToRedisApi 