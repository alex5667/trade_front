import { createApi } from '@reduxjs/toolkit/query/react'

import { TypeUserForm, User } from '@/types/auth.types'

import { URLS } from '@/config/urls'
import { setBreakInterval, setWorkInterval } from '@/store/pomodoro/pomodoro.slice'
import { baseQueryWIthReAuth } from './baseQueries'

export interface IProfileResponse {
	user: User
	statistics: {
		label: string
		value: string
	}[]
}

export const userApi = createApi({
	reducerPath: 'userApi',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['profile', 'updateProfile'],
	endpoints: builder => ({
		getProfile: builder.query<IProfileResponse, void>({
			query: () => ({
				url: URLS.USER_PROFILE,
				method: 'GET'
			}),
			providesTags: ['profile'],
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const { data } = await queryFulfilled
					dispatch(setWorkInterval(data.user.workInterval))
					dispatch(setBreakInterval(data.user.breakInterval))
				} catch (err) {
					console.error('Failed to fetch profile:', err)
				}
			}
		}),
		updateUser: builder.mutation<IProfileResponse, TypeUserForm>({
			query: data => ({
				url: URLS.USER_PROFILE,
				method: 'PUT',
				body: data
			}),

			invalidatesTags: ['profile'],
			onQueryStarted: async (arg, { queryFulfilled }) => {
				try {
					await queryFulfilled
				} catch (err) {
					console.error('Failed to update profile:', err)
				}
			}
		})
	})
})
export const { useGetProfileQuery, useUpdateUserMutation, usePrefetch } =
	userApi
