import { createApi } from '@reduxjs/toolkit/query/react'

import { TypeUserForm, User } from '@/types/auth.types'

import { URLS } from '@/config/urls'

import { addUser } from '@/store/user/user.slice'
import { baseQueryWIthReAuth } from './baseQueries'

export interface ProfileResponse {
	user: User

}

export const userApi = createApi({
	reducerPath: 'userApi',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['profile', 'updateProfile'],
	endpoints: builder => ({
		getProfile: builder.query<ProfileResponse, void>({
			query: () => ({
				url: URLS.USER_PROFILE,
				method: 'GET'
			}),
			providesTags: ['profile'],
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const { data } = await queryFulfilled
					dispatch(addUser(data.user))
					// const { data } = await queryFulfilled
					// dispatch(setWorkInterval(data.user.workInterval))
					// dispatch(setBreakInterval(data.user.breakInterval))
				} catch {
					// Ошибка обрабатывается RTK Query автоматически
				}
			}
		}),
		updateUser: builder.mutation<ProfileResponse, TypeUserForm>({
			query: data => ({
				url: URLS.USER_PROFILE,
				method: 'PUT',
				body: data
			}),

			invalidatesTags: ['profile'],
			onQueryStarted: async (arg, { queryFulfilled }) => {
				try {
					await queryFulfilled
				} catch {
					// Ошибка обрабатывается RTK Query автоматически
				}
			}
		})
	})
})
export const { useGetProfileQuery, useUpdateUserMutation, usePrefetch } =
	userApi
