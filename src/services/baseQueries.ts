import { fetchBaseQuery, retry } from '@reduxjs/toolkit/query'

import { AuthResponse } from '@/types/auth.types'

import { errorCatch } from '@/api/error'

import { URLS } from '@/config/urls'
import {
	getAccessToken,
	removeFromStorage,
	saveTokenStorage
} from './auth-token.service'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
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
			headers.set('Origin', window.location.origin)

			return headers
		},

		responseHandler: async (response) => {
			if (!response.ok) {
				if (response.status === 404) {
					return { error: 'Not Found' }
				}
				const errorMessage = await response.text()
				return { error: errorMessage || 'An error occurred' }
			}

			// Если тело ответа пустое, возвращаем пустой объект
			const text = await response.text()
			if (!text) {
				return {} // пустой ответ
			}

			try {
				return JSON.parse(text) // Парсим JSON, если он есть
			} catch (error) {
				console.error('Ошибка парсинга JSON:', error)
				return { error: 'Ошибка парсинга JSON' }
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
			URLS.AUTH_LOGIN_ACCESS_TOKEN,
			api,
			extraOptions
		)
		const refreshResultData = refreshResult.data as AuthResponse
		if (refreshResultData.accessToken) {
			saveTokenStorage(refreshResultData.accessToken)
			result = await baseQuery(args, api, extraOptions)
		} else {
			removeFromStorage()
		}
	} else if (result.error) {
		// Improved error logging with more details
		const errorMessage = errorCatch(result.error)
		const errorDetails = {
			message: errorMessage,
			status: result.error.status || 'unknown',
			originalError: result.error
		}
		console.error('Base query error:', errorDetails)
	}
	return result
}
