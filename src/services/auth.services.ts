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
				} catch (err) {
					console.error('Login error:', err)
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
				} catch (err) {
					console.error('Registration error:', err)
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
				} catch (err) {
					console.error('Logout error:', err)
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
				} catch (err) {
					console.error('Google login error:', err)
				}
			}
		}),
		/** Обработка callback после авторизации через Google */
		handleGoogleCallback: builder.mutation<AuthResponse, void>({
			query: () => ({
				url: URLS.USER_PROFILE,
				method: 'GET',
				credentials: 'include'
			}),
			transformResponse: (response: any) => {
				if (response?.accessToken) {
					saveTokenStorage(response.accessToken)
					if (response.refreshToken) {
						saveRefreshToken(response.refreshToken)
					}
				}
				return response
			},
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const { data } = await queryFulfilled
					if (data?.user) {
						dispatch(addUser(data.user))
					}
				} catch (err) {
					console.error('Failed to get user profile:', err)
				}
			}
		})
	})
})

export const {
	useLoginMutation,
	useRegisterMutation,
	useLogoutMutation,
	useLoginGoogleMutation,
	useHandleGoogleCallbackMutation
} = authApi
