import { createApi } from '@reduxjs/toolkit/query/react'

import { AuthForm, AuthResponse } from '@/types/auth.types'

import { URLS } from '@/config/urls'
import { addUser } from '@/store/user/user.slice'
import { removeFromStorage, saveTokenStorage } from './auth-token.service'
import { baseQueryWIthReAuth } from './baseQueries'

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['auth'],
	endpoints: builder => ({
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
				console.log('response.accessToken transformResponse', response.accessToken)
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
		})
	})
})
export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
	authApi
