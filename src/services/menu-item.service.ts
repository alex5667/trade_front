import { URLS } from '@/config/urls'
import { getAllItems } from '@/store/menuItem/menu-item.slice'
import { MenuItemDataFilters, MenuItemResponse } from '@/types/menuItem.type'
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
					dispatch(getAllItems(data.data))
				} catch (err) {
					console.error('Failed to fetch menu...', err)
				}
			}
		}),

		getByInstitutionSlug: builder.query<MenuItemResponse[], string>({
			query: (institutionSlug) => ({
				url: `${URLS.MENU_ITEM_BY_INSTITUTION}/${institutionSlug}`,
				method: 'GET',
			}),
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const data = await queryFulfilled
					dispatch(getAllItems(data.data))
				} catch (err) {
					console.error('Failed to fetch menu...', err)
				}
			}
		}),

	})
})
export const { useGetAllQuery, usePrefetch, useGetByInstitutionSlugQuery } = menuItemApi