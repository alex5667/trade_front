import { fetchBaseQuery, retry } from '@reduxjs/toolkit/query'

import { AuthResponse } from '@/types/auth.types'

import { errorCatch } from '@/api/error'

import { URLS } from '@/config/urls'
import {
	getAccessToken,
	removeFromStorage,
	saveTokenStorage
} from './auth-token.service'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4200/api'
export const baseQuery = retry(
	fetchBaseQuery({
		baseUrl: API_BASE_URL,
		credentials: 'include',

		prepareHeaders: (headers) => {
			const accessToken = getAccessToken()

			if (accessToken) {
				headers.set('Authorization', `Bearer ${accessToken}`)
			}

			headers.set('Content-Type', 'application/json')
			try {
				// window может отсутствовать на сервере
				if (typeof window !== 'undefined') {
					headers.set('Origin', window.location.origin)
				}
			} catch { }

			return headers
		},

		responseHandler: async (response) => {
			// Не вмешиваемся в обработку ошибок HTTP: пусть fetchBaseQuery сам проставит error
			if (!response.ok) {
				// Возвращаем пустой объект — фактическая ошибка будет в result.error
				return {}
			}

			// 204 No Content или пустое тело
			if (response.status === 204) return {}
			const text = await response.text()
			if (!text) return {}

			try {
				return JSON.parse(text)
			} catch (error) {
				console.error('Ошибка парсинга JSON:', error)
				// Возвращаем сырой текст как data, чтобы не терять информацию
				return { message: text }
			}
		}
	}),
	{
		maxRetries: 3
	}
)

export const baseQueryWIthReAuth: typeof baseQuery = async (
	args,
	api,
	extraOptions
) => {
	let result = await baseQuery(args, api, extraOptions)
	if (
		result.error &&
		(result.error.status === 401 ||
			errorCatch(result.error) === 'jwt expired' ||
			errorCatch(result.error) === 'jwt must be provided')
	) {
		const refreshResult = await baseQuery(
			{
				url: URLS.AUTH_LOGIN_ACCESS_TOKEN,
				method: 'POST',
				body: {}
			},
			api,
			extraOptions
		)
		const refreshResultData = refreshResult.data as AuthResponse
		if (refreshResultData?.accessToken) {
			saveTokenStorage(refreshResultData.accessToken)
			result = await baseQuery(args, api, extraOptions)
		} else {
			removeFromStorage()
		}
	} else if (result.error) {
		// Улучшенный лог ошибок
		const message = errorCatch(result.error)
		const details = {
			message,
			status: (result.error as any)?.status || 'unknown',
			data: (result.error as any)?.data ?? null,
			raw: result.error
		}
		console.error('Base query error:', details)
	}
	return result
}
