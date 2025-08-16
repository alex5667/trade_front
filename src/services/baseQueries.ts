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
				// Возвращаем объект с информацией об ошибке вместо пустого объекта
				const errorText = await response.text().catch(() => 'Unknown error')
				return {
					error: true,
					status: response.status,
					statusText: response.statusText,
					message: errorText || `HTTP ${response.status} ${response.statusText}`
				}
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
		const status = (result.error as any)?.status || 'unknown'
		const data = (result.error as any)?.data ?? null

		// Проверяем, что error не является пустым объектом
		if (Object.keys(result.error).length > 0 || message !== '{}') {
			const details = {
				message,
				status,
				data,
				raw: result.error
			}
			console.error('Base query error:', details)
		} else {
			// Если error пустой, логируем базовую информацию
			const endpoint = typeof args === 'string' ? args : (args as any)?.url || 'unknown endpoint'
			console.error('Base query error: Empty error object', {
				status,
				data,
				args: endpoint
			})
		}
	}
	return result
}
