import { createApi } from '@reduxjs/toolkit/query/react'

import { URLS } from '@/config/urls'
import { setTelegramChannels } from '@/store/signals/slices/telegramChannels.slice'
import type { TelegramChannelUpsert } from '@/types/telegram.types'
import { baseQueryWIthReAuth } from './baseQueries'

export interface TelegramChannel {
	id: string | number
	title: string
	username?: string
	chatId?: string | number
	createdAt?: string
	updatedAt?: string
}

export type CreateTelegramChannelDto = TelegramChannelUpsert

export interface UpdateTelegramChannelDto {
	id: string | number
	data: Partial<CreateTelegramChannelDto>
}

export interface PaginatedResponse<T> {
	data: T[]
	total: number
	limit: number
	offset: number
}

export type OrderDirection = 'asc' | 'desc'
export type OrderByField = 'createdAt' | 'updatedAt' | 'membersCount' | 'winratePct' | 'lastPostAt' | 'title' | 'username'

export interface GetTelegramChannelsParams {
	// filters
	titleContains?: string
	usernameContains?: string
	linkContains?: string
	language?: string
	status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
	isPaid?: boolean
	signalsFormat?: 'NONE' | 'ENTRY_SL_TP' | 'ANALYTICS' | 'BOTH'
	source?: 'MANUAL' | 'SCRAPED' | 'IMPORTED'
	marketsHas?: string
	tagsHas?: string
	membersCountMin?: number
	membersCountMax?: number
	winratePctMin?: number
	winratePctMax?: number
	priceMin?: number
	priceMax?: number
	createdFrom?: string
	createdTo?: string
	lastPostFrom?: string
	lastPostTo?: string
	// pagination & sorting
	limit?: number
	offset?: number
	orderBy?: OrderByField
	order?: OrderDirection
	// Служебный параметр для принудительного обновления
	_refresh?: number
}

export const telegramChannelApi = createApi({
	reducerPath: 'telegramChannelApi',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['TelegramChannel'],
	endpoints: (builder) => ({
		getTelegramChannels: builder.query<PaginatedResponse<TelegramChannel>, GetTelegramChannelsParams | void>({
			query: (params) => {
				// Если параметры undefined, загружаем все каналы без фильтров
				if (!params) {
					return { url: URLS.TELEGRAM_CHANNELS, method: 'GET' }
				}
				// Убираем служебный параметр _refresh из запроса
				const { _refresh, ...cleanParams } = params
				return { url: URLS.TELEGRAM_CHANNELS, method: 'GET', params: cleanParams }
			},
			transformResponse: (response: any) => response?.data ? response : { data: response },
			providesTags: ['TelegramChannel'],
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled
					// @ts-ignore
					dispatch(setTelegramChannels(Array.isArray(data?.data) ? data.data : []))
				} catch { }
			},
		}),
		getTelegramChannelById: builder.query<TelegramChannel, string | number>({
			query: (id) => ({ url: `${URLS.TELEGRAM_CHANNEL}/${id}`, method: 'GET' }),
			transformResponse: (response: any) => response?.data ?? response,
			providesTags: (_res, _err, id) => [{ type: 'TelegramChannel', id } as any],
		}),
		createTelegramChannel: builder.mutation<TelegramChannel, CreateTelegramChannelDto>({
			query: (body) => ({ url: URLS.TELEGRAM_CHANNELS, method: 'POST', body }),
			invalidatesTags: ['TelegramChannel'],
		}),
		updateTelegramChannel: builder.mutation<TelegramChannel, UpdateTelegramChannelDto>({
			query: ({ id, data }) => ({ url: `${URLS.TELEGRAM_CHANNEL}/${id}`, method: 'PUT', body: data }),
			invalidatesTags: (_res, _err, arg) => [{ type: 'TelegramChannel', id: arg.id } as any, 'TelegramChannel'],
		}),
		deleteTelegramChannel: builder.mutation<{ success: boolean }, string | number>({
			query: (id) => ({ url: `${URLS.TELEGRAM_CHANNEL}/${id}`, method: 'DELETE' }),
			invalidatesTags: (_res, _err, id) => [{ type: 'TelegramChannel', id } as any, 'TelegramChannel'],
		}),
	})
})

export const { useGetTelegramChannelsQuery, useGetTelegramChannelByIdQuery, useCreateTelegramChannelMutation, useUpdateTelegramChannelMutation, useDeleteTelegramChannelMutation } = telegramChannelApi 