import { createApi } from '@reduxjs/toolkit/query/react'

import { URLS } from '@/config/urls'
import type {
	BulkCreateSymbolsDto,
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
			providesTags: (result) =>
				result
					? [
						...result.data.map(({ id }) => ({ type: 'SymbolToRedis' as const, id })),
						{ type: 'SymbolToRedis', id: 'LIST' }
					]
					: [{ type: 'SymbolToRedis', id: 'LIST' }]
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
			invalidatesTags: [{ type: 'SymbolToRedis', id: 'LIST' }]
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
				{ type: 'SymbolToRedis', id: 'LIST' }
			]
		}),

		// Удалить символ
		deleteSymbol: builder.mutation<void, string>({
			query: (id) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/${id}`,
				method: 'DELETE'
			}),
			invalidatesTags: (result, error, id) => [
				{ type: 'SymbolToRedis', id },
				{ type: 'SymbolToRedis', id: 'LIST' }
			]
		}),

		// Поиск символов
		searchSymbols: builder.query<SymbolSearchResult[], any>({
			query: (params) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/search`,
				method: 'GET',
				params
			}),
			providesTags: [{ type: 'SymbolToRedis', id: 'LIST' }]
		}),

		// Нормализация символа
		normalizeSymbol: builder.mutation<SymbolNormalization, { symbol: string }>({
			query: (data) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/normalize`,
				method: 'POST',
				body: data
			})
		}),

		// Массовое создание символов
		bulkCreateSymbols: builder.mutation<SymbolToRedis[], BulkCreateSymbolsDto>({
			query: (data) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/bulk`,
				method: 'POST',
				body: data
			}),
			invalidatesTags: [{ type: 'SymbolToRedis', id: 'LIST' }]
		}),

		// Получить статистику
		getStats: builder.query<SymbolToRedisStats, string | void>({
			query: (groupBy) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/stats`,
				method: 'GET',
				params: groupBy ? { groupBy } : undefined
			}),
			providesTags: [{ type: 'SymbolToRedis', id: 'STATS' }]
		}),

		// Фильтрация по базовой валюте
		getSymbolsByBaseAsset: builder.query<string[], string>({
			query: (baseAsset) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/base/${baseAsset}`,
				method: 'GET'
			}),
			providesTags: [{ type: 'SymbolToRedis', id: 'LIST' }]
		}),

		// Фильтрация по котируемой валюте
		getSymbolsByQuoteAsset: builder.query<string[], string>({
			query: (quoteAsset) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/quote/${quoteAsset}`,
				method: 'GET'
			}),
			providesTags: [{ type: 'SymbolToRedis', id: 'LIST' }]
		}),

		// Фильтрация по типу инструмента
		getSymbolsByInstrumentType: builder.query<string[], string>({
			query: (instrumentType) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/type/${instrumentType}`,
				method: 'GET'
			}),
			providesTags: [{ type: 'SymbolToRedis', id: 'LIST' }]
		}),

		// Фильтрация по таймфрейму
		getSymbolsByTimeframe: builder.query<string[], string>({
			query: (timeframe) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/timeframe/${timeframe}`,
				method: 'GET'
			}),
			providesTags: [{ type: 'SymbolToRedis', id: 'LIST' }]
		}),

		// Redis операции
		getRedisSymbols: builder.query<string[], void>({
			query: () => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/redis/all`,
				method: 'GET'
			}),
			providesTags: [{ type: 'SymbolToRedis', id: 'REDIS' }]
		}),

		getRedisSymbolsByBaseAsset: builder.query<string[], string>({
			query: (baseAsset) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/redis/base/${baseAsset}`,
				method: 'GET'
			}),
			providesTags: [{ type: 'SymbolToRedis', id: 'REDIS' }]
		}),

		getRedisSymbolsByQuoteAsset: builder.query<string[], string>({
			query: (quoteAsset) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/redis/quote/${quoteAsset}`,
				method: 'GET'
			}),
			providesTags: [{ type: 'SymbolToRedis', id: 'REDIS' }]
		}),

		getRedisSymbolsByInstrumentType: builder.query<string[], string>({
			query: (instrumentType) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/redis/type/${instrumentType}`,
				method: 'GET'
			}),
			providesTags: [{ type: 'SymbolToRedis', id: 'REDIS' }]
		}),

		getRedisSymbolsByTimeframe: builder.query<string[], string>({
			query: (timeframe) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/redis/timeframe/${timeframe}`,
				method: 'GET'
			}),
			providesTags: [{ type: 'SymbolToRedis', id: 'REDIS' }]
		}),

		getRedisSymbolDetails: builder.query<any, string>({
			query: (symbol) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/redis/details/${symbol}`,
				method: 'GET'
			}),
			providesTags: [{ type: 'SymbolToRedis', id: 'REDIS' }]
		}),

		checkRedisSymbolExists: builder.query<{ exists: boolean }, string>({
			query: (symbol) => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/redis/exists/${symbol}`,
				method: 'GET'
			}),
			providesTags: [{ type: 'SymbolToRedis', id: 'REDIS' }]
		}),

		getRedisStats: builder.query<any, void>({
			query: () => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/redis/stats`,
				method: 'GET'
			}),
			providesTags: [{ type: 'SymbolToRedis', id: 'REDIS' }]
		}),

		clearRedisData: builder.mutation<void, void>({
			query: () => ({
				url: `${URLS.SYMBOLS_TO_REDIS}/redis/clear`,
				method: 'DELETE'
			}),
			invalidatesTags: [
				{ type: 'SymbolToRedis', id: 'LIST' },
				{ type: 'SymbolToRedis', id: 'REDIS' }
			]
		}),

		// Excel Import endpoints
		getExcelImportInfo: builder.query<any, void>({
			query: () => ({ url: `${URLS.SYMBOLS_TO_REDIS_EXCEL}/info`, method: 'GET' }),
		}),
		downloadExcelTemplate: builder.mutation<Blob, void>({
			query: () => ({
				url: `${URLS.SYMBOLS_TO_REDIS_EXCEL}/template`,
				method: 'GET',
				responseHandler: (response) => response.blob()
			}),
		}),
		uploadExcelData: builder.mutation<any, any[]>({
			query: (data) => ({
				url: `${URLS.SYMBOLS_TO_REDIS_EXCEL}/upload`,
				method: 'POST',
				body: data,
				headers: {
					'Content-Type': 'application/json'
				}
			}),
			invalidatesTags: [{ type: 'SymbolToRedis', id: 'LIST' }],
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
	useBulkCreateSymbolsMutation,
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
	useClearRedisDataMutation,
	useGetExcelImportInfoQuery,
	useDownloadExcelTemplateMutation,
	useUploadExcelDataMutation
} = symbolToRedisApi 