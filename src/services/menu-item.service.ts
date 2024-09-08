import { URLS } from '@/config/urls'
import { addItems } from '@/store/menuItem/user.slice'
import { MenuItemDataFilters, MenuItemResponse } from '@/types/menuItem.types'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWIthReAuth } from './baseQueries'



export const menuItemApi = createApi({
	reducerPath: 'menu',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['menu'],
	endpoints: builder => ({

		getAll: builder.query<MenuItemResponse[], MenuItemDataFilters>({
			query: (queryData = {} as MenuItemDataFilters) => ({
				url: URLS.MENU_ITEM,
				method: 'GET',
				params: queryData
			}),
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const data = await queryFulfilled
					dispatch(addItems(data.data))
				} catch (err) {
					console.error('Failed to fetch menu...', err)
				}
			}
		}),

	})
})
export const { useGetAllQuery, usePrefetch } = menuItemApi