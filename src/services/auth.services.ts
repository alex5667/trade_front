/**
 * Сервис авторизации
 * --------------------------------
 * RTK Query API для управления аутентификацией пользователей
 * Включает операции входа, регистрации, выхода и OAuth через Google
 */

import { createApi } from '@reduxjs/toolkit/query/react'

import { AuthForm, AuthResponse } from '@/types/auth.types'

import { URLS } from '@/config/urls'
import { addUser } from '@/store/user/user.slice'
import { removeFromStorage, saveRefreshToken, saveTokenStorage } from './auth-token.service'
import { baseQueryWIthReAuth } from './baseQueries'

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['auth'],
	endpoints: builder => ({
		/** Авторизация пользователя по email и паролю */
		login: builder.mutation<AuthResponse, AuthForm>({
			query: data => ({
				url: URLS.AUTH_LOGIN,
				method: 'POST',
				body: data
			}),
			transformResponse: (response: AuthResponse) => {
				if (!response.accessToken) {
					throw new Error('Login failed: Access token is missing')
				}

				saveTokenStorage(response.accessToken)
				return response
			},
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const { data } = await queryFulfilled
					dispatch(addUser(data.user))
				} catch {
					removeFromStorage()
				}
			}
		}),
		/** Авторизация по телефону */
		loginByPhone: builder.mutation<AuthResponse, { phone: string; password: string }>({
			query: data => ({
				url: URLS.AUTH_LOGIN_PHONE,
				method: 'POST',
				body: data
			}),
			transformResponse: (response: AuthResponse) => {
				if (!response.accessToken) {
					throw new Error('Phone login failed: Access token is missing')
				}
				saveTokenStorage(response.accessToken)
				return response
			},
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const { data } = await queryFulfilled
					dispatch(addUser(data.user))
				} catch {
					removeFromStorage()
				}
			}
		}),
		/** Регистрация нового пользователя */
		register: builder.mutation<AuthResponse, AuthForm>({
			query: data => ({
				url: URLS.AUTH_REGISTER,
				method: 'POST',
				body: data
			}),
			transformResponse: (response: AuthResponse) => {
				if (!response.accessToken) {
					throw new Error('Registration failed: Access token is missing')
				}
				saveTokenStorage(response.accessToken)
				return response
			},
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const { data } = await queryFulfilled
					dispatch(addUser(data.user))
				} catch {
					removeFromStorage()
				}
			}
		}),
		/** Регистрация по телефону */
		registerByPhone: builder.mutation<AuthResponse, { phone: string; password: string; firstName?: string; lastName?: string }>({
			query: data => ({
				url: URLS.AUTH_REGISTER_PHONE,
				method: 'POST',
				body: data
			}),
			transformResponse: (response: AuthResponse) => {
				if (!response.accessToken) {
					throw new Error('Phone registration failed: Access token is missing')
				}
				saveTokenStorage(response.accessToken)
				return response
			},
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const { data } = await queryFulfilled
					dispatch(addUser(data.user))
				} catch {
					removeFromStorage()
				}
			}
		}),
		/** Выход пользователя из системы */
		logout: builder.mutation<void, void>({
			query: () => ({
				url: URLS.AUTH_LOGOUT,
				method: 'POST'
			}),
			transformResponse: () => {
				removeFromStorage()
			},
			onQueryStarted: async (arg, { queryFulfilled }) => {
				try {
					await queryFulfilled
				} catch {
					// Ошибка обрабатывается RTK Query
				}
			}
		}),
		/** Авторизация через Google OAuth */
		loginGoogle: builder.mutation<AuthResponse, void>({
			query: () => ({
				url: URLS.AUTH_GOOGLE,
				method: 'GET',
				credentials: 'include'
			}),
			transformResponse: (response: AuthResponse) => {
				if (!response.accessToken) {
					throw new Error('Google login failed: Access token is missing')
				}
				saveTokenStorage(response.accessToken)
				if (response.refreshToken) {
					saveRefreshToken(response.refreshToken)
				}
				return response
			},
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const { data } = await queryFulfilled
					dispatch(addUser(data.user))
				} catch {
					// Ошибка обрабатывается RTK Query
				}
			}
		})
	})
})

export const {
	useLoginMutation,
	useLoginByPhoneMutation,
	useRegisterMutation,
	useRegisterByPhoneMutation,
	useLogoutMutation,
	useLoginGoogleMutation
} = authApi
